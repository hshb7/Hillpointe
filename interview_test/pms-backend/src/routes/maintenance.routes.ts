import express from 'express';
import { body, validationResult } from 'express-validator';
import Maintenance from '../models/Maintenance.model';
import Property from '../models/Property.model';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, priority, property, category } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (property) filter.property = property;

    if (req.user!.role === 'tenant') {
      filter.reportedBy = req.userId;
    }

    const maintenanceRequests = await Maintenance.find(filter)
      .populate('property', 'name address')
      .populate('reportedBy', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ requests: maintenanceRequests, totalCount: maintenanceRequests.length });
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('property')
      .populate('tenant')
      .populate('reportedBy', 'firstName lastName email phoneNumber')
      .populate('assignedTo', 'firstName lastName email phoneNumber')
      .populate('notes.author', 'firstName lastName');

    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    res.json({ maintenance });
  } catch (error) {
    console.error('Get maintenance request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('property').notEmpty(),
    body('category').isIn(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'landscaping', 'pest', 'other']),
    body('priority').isIn(['low', 'medium', 'high', 'emergency']),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('location').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const maintenanceCount = await Maintenance.countDocuments();
      const ticketId = `MAINT-${Date.now()}-${maintenanceCount + 1}`;

      const maintenance = new Maintenance({
        ...req.body,
        ticketId,
        reportedBy: req.userId,
        timeline: [{
          status: 'pending',
          timestamp: new Date(),
          user: req.userId,
          comment: 'Request created',
        }],
      });

      await maintenance.save();
      await maintenance.populate('property', 'name address');
      await maintenance.populate('reportedBy', 'firstName lastName email');

      const property = await Property.findById(req.body.property);
      if (property) {
        property.maintenance.history.push(maintenance._id as any);
        await property.save();
      }

      res.status(201).json({
        message: 'Maintenance request created successfully',
        maintenance,
      });
    } catch (error) {
      console.error('Create maintenance request error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'maintenance'),
  async (req: AuthRequest, res) => {
    try {
      const maintenance = await Maintenance.findById(req.params.id);

      if (!maintenance) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }

      const { status, assignedTo, estimatedCost, scheduledDate } = req.body;

      if (status && status !== maintenance.status) {
        maintenance.timeline.push({
          status,
          timestamp: new Date(),
          user: req.userId as any,
          comment: `Status changed to ${status}`,
        });

        if (status === 'completed') {
          maintenance.completedDate = new Date();
        }
      }

      if (assignedTo) maintenance.assignedTo = assignedTo;
      if (estimatedCost) maintenance.estimatedCost = estimatedCost;
      if (scheduledDate) maintenance.scheduledDate = scheduledDate;

      Object.assign(maintenance, req.body);
      await maintenance.save();

      res.json({
        message: 'Maintenance request updated successfully',
        maintenance,
      });
    } catch (error) {
      console.error('Update maintenance request error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/:id/notes',
  authenticateToken,
  [body('content').trim().notEmpty()],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const maintenance = await Maintenance.findById(req.params.id);

      if (!maintenance) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }

      maintenance.notes.push({
        author: req.userId as any,
        content: req.body.content,
        timestamp: new Date(),
      });

      await maintenance.save();

      res.json({
        message: 'Note added successfully',
        maintenance,
      });
    } catch (error) {
      console.error('Add note error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/analytics/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const totalRequests = await Maintenance.countDocuments();
    const pendingRequests = await Maintenance.countDocuments({ status: 'pending' });
    const inProgressRequests = await Maintenance.countDocuments({ status: 'in-progress' });
    const completedRequests = await Maintenance.countDocuments({ status: 'completed' });

    const emergencyRequests = await Maintenance.countDocuments({ priority: 'emergency' });
    const highPriorityRequests = await Maintenance.countDocuments({ priority: 'high' });

    const categoryBreakdown = await Maintenance.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const averageCompletionTime = await Maintenance.aggregate([
      {
        $match: {
          status: 'completed',
          completedDate: { $exists: true },
        },
      },
      {
        $project: {
          completionTime: {
            $subtract: ['$completedDate', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$completionTime' },
        },
      },
    ]);

    res.json({
      summary: {
        total: totalRequests,
        pending: pendingRequests,
        inProgress: inProgressRequests,
        completed: completedRequests,
        emergency: emergencyRequests,
        highPriority: highPriorityRequests,
        categoryBreakdown,
        averageCompletionTime: averageCompletionTime[0]?.avgTime || 0,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;