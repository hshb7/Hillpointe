import express from 'express';
import { body, validationResult } from 'express-validator';
import Payment from '../models/Payment.model';
import Tenant from '../models/Tenant.model';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, type, property, tenant, startDate, endDate } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (property) filter.property = property;
    if (tenant) filter.tenant = tenant;

    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate as string);
      if (endDate) filter.dueDate.$lte = new Date(endDate as string);
    }

    if (req.user!.role === 'tenant') {
      const userTenant = await Tenant.findOne({ user: req.userId });
      if (userTenant) {
        filter.tenant = userTenant._id;
      }
    }

    const payments = await Payment.find(filter)
      .populate('property', 'name address')
      .populate('tenant', 'user')
      .populate({
        path: 'tenant',
        populate: {
          path: 'user',
          select: 'firstName lastName email',
        },
      })
      .sort({ dueDate: -1 });

    res.json({ paymentList: payments, paymentCount: payments.length });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('property')
      .populate({
        path: 'tenant',
        populate: {
          path: 'user',
          select: 'firstName lastName email phoneNumber',
        },
      })
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (req.user!.role === 'tenant') {
      const userTenant = await Tenant.findOne({ user: req.userId });
      if (!userTenant || payment.tenant.toString() !== userTenant._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    res.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'owner'),
  [
    body('property').notEmpty(),
    body('tenant').notEmpty(),
    body('type').isIn(['rent', 'deposit', 'late-fee', 'maintenance', 'utility', 'other']),
    body('amount').isFloat({ min: 0 }),
    body('dueDate').isISO8601(),
    body('description').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const paymentCount = await Payment.countDocuments();
      const paymentId = `PAY-${Date.now()}-${paymentCount + 1}`;

      const payment = new Payment({
        ...req.body,
        paymentId,
        createdBy: req.userId,
      });

      await payment.save();
      await payment.populate('property', 'name address');
      await payment.populate({
        path: 'tenant',
        populate: {
          path: 'user',
          select: 'firstName lastName email',
        },
      });

      const tenant = await Tenant.findById(req.body.tenant);
      if (tenant) {
        tenant.paymentHistory.push({
          date: payment.dueDate,
          amount: payment.amount,
          type: payment.type,
          status: 'pending',
          paymentMethod: '',
        });
        await tenant.save();
      }

      res.status(201).json({
        message: 'Payment created successfully',
        payment,
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/:id/pay',
  authenticateToken,
  [
    body('method').isIn(['cash', 'check', 'credit-card', 'debit-card', 'ach', 'wire', 'online', 'other']),
    body('transactionId').optional().trim(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (payment.status === 'paid') {
        return res.status(400).json({ error: 'Payment already paid' });
      }

      payment.status = 'paid';
      payment.paidDate = new Date();
      payment.method = req.body.method;
      payment.transactionId = req.body.transactionId;
      payment.updatedBy = req.userId as any;

      await payment.save();

      const tenant = await Tenant.findById(payment.tenant);
      if (tenant) {
        const paymentHistoryItem = tenant.paymentHistory.find(
          (p) => p.date.toISOString() === payment.dueDate.toISOString() && p.amount === payment.amount
        );
        if (paymentHistoryItem) {
          paymentHistoryItem.status = 'paid';
          paymentHistoryItem.paymentMethod = req.body.method;
          paymentHistoryItem.transactionId = req.body.transactionId;
          await tenant.save();
        }
      }

      res.json({
        message: 'Payment processed successfully',
        payment,
      });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'owner'),
  async (req: AuthRequest, res) => {
    try {
      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (payment.status === 'paid' && req.body.status !== 'refunded') {
        return res.status(400).json({ error: 'Cannot modify paid payment' });
      }

      payment.updatedBy = req.userId as any;
      Object.assign(payment, req.body);
      await payment.save();

      res.json({
        message: 'Payment updated successfully',
        payment,
      });
    } catch (error) {
      console.error('Update payment error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/analytics/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;

    const startDate = month
      ? new Date(Number(year), Number(month) - 1, 1)
      : new Date(Number(year), 0, 1);

    const endDate = month
      ? new Date(Number(year), Number(month), 0)
      : new Date(Number(year), 11, 31);

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: startDate, $lte: endDate },
          type: { $in: ['rent', 'deposit'] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const pendingPayments = await Payment.aggregate([
      {
        $match: {
          status: { $in: ['pending', 'late'] },
          dueDate: { $lte: new Date() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const paymentsByType = await Payment.aggregate([
      {
        $match: {
          paidDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$paidDate' },
            year: { $year: '$paidDate' },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.json({
      summary: {
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingAmount: pendingPayments[0]?.total || 0,
        pendingCount: pendingPayments[0]?.count || 0,
        paymentsByType,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error('Get payment analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/:id/reminder',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'owner'),
  async (req: AuthRequest, res) => {
    try {
      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      payment.reminders.push({
        sentDate: new Date(),
        method: req.body.method || 'email',
        status: 'sent',
      });

      await payment.save();

      res.json({
        message: 'Reminder sent successfully',
        payment,
      });
    } catch (error) {
      console.error('Send reminder error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;