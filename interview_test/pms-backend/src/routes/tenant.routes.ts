import express from 'express';
import { body, validationResult } from 'express-validator';
import Tenant from '../models/Tenant.model';
import User from '../models/User.model';
import Property from '../models/Property.model';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, property } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (property) filter.property = property;

    const tenants = await Tenant.find(filter)
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });

    res.json({ tenantData: tenants, count: tenants.length });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate('user')
      .populate('property')
      .populate('maintenanceRequests')
      .populate('paymentHistory');

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    if (req.user!.role === 'tenant' && tenant.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ tenant });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'owner'),
  [
    body('user').notEmpty(),
    body('property').notEmpty(),
    body('leaseStart').isISO8601(),
    body('leaseEnd').isISO8601(),
    body('monthlyRent').isFloat({ min: 0 }),
    body('securityDeposit').isFloat({ min: 0 }),
    body('emergencyContact.name').trim().notEmpty(),
    body('emergencyContact.relationship').trim().notEmpty(),
    body('emergencyContact.phone').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existingTenant = await Tenant.findOne({
        user: req.body.user,
        property: req.body.property,
        status: 'active',
      });

      if (existingTenant) {
        return res.status(400).json({ error: 'Tenant already exists for this property' });
      }

      const tenant = new Tenant(req.body);
      await tenant.save();

      const property = await Property.findById(req.body.property);
      if (property) {
        property.status = 'occupied';
        property.lease = {
          tenant: tenant._id as any,
          startDate: tenant.leaseStart,
          endDate: tenant.leaseEnd,
          rentAmount: tenant.monthlyRent,
          paymentDay: 1,
          terms: '',
          documents: [],
        };
        await property.save();
      }

      const user = await User.findById(req.body.user);
      if (user && user.role === 'tenant') {
        user.properties = user.properties || [];
        user.properties.push(req.body.property);
        await user.save();
      }

      await tenant.populate('user', 'firstName lastName email');
      await tenant.populate('property', 'name address');

      res.status(201).json({
        message: 'Tenant created successfully',
        tenant,
      });
    } catch (error) {
      console.error('Create tenant error:', error);
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
      const tenant = await Tenant.findById(req.params.id);

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      Object.assign(tenant, req.body);
      await tenant.save();

      res.json({
        message: 'Tenant updated successfully',
        tenant,
      });
    } catch (error) {
      console.error('Update tenant error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/:id/move-out',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'owner'),
  [
    body('moveOutDate').isISO8601(),
    body('moveOutCondition').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tenant = await Tenant.findById(req.params.id);

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      tenant.status = 'past';
      tenant.moveOutDate = req.body.moveOutDate;
      tenant.moveOutCondition = req.body.moveOutCondition;
      await tenant.save();

      const property = await Property.findById(tenant.property);
      if (property) {
        property.status = 'available';
        property.lease = undefined;
        await property.save();
      }

      res.json({
        message: 'Tenant moved out successfully',
        tenant,
      });
    } catch (error) {
      console.error('Move out error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/:id/documents', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    if (req.user!.role === 'tenant' && tenant.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ documents: tenant.documents });
  } catch (error) {
    console.error('Get tenant documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/:id/documents',
  authenticateToken,
  [
    body('type').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('url').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tenant = await Tenant.findById(req.params.id);

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      if (req.user!.role === 'tenant' && tenant.user.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      tenant.documents.push({
        ...req.body,
        uploadDate: new Date(),
      });

      await tenant.save();

      res.json({
        message: 'Document added successfully',
        tenant,
      });
    } catch (error) {
      console.error('Add document error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;