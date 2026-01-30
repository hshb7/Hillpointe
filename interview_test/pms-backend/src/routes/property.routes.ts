import express from 'express';
import { body, validationResult } from 'express-validator';
import Property from '../models/Property.model';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, type, minPrice, maxPrice, bedrooms, bathrooms, city } = req.query;
    const filter: any = {};

    if (status) filter.propertyStatus = status;
    if (type) filter.propertyType = type;
    if (city) filter['location.city'] = new RegExp(city as string, 'i');
    if (bedrooms) filter['specs.beds'] = Number(bedrooms);
    if (bathrooms) filter['specs.baths'] = Number(bathrooms);

    if (minPrice || maxPrice) {
      filter['pricing.rent'] = {};
      if (minPrice) filter['pricing.rent'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.rent'].$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('propertyOwner', 'firstName lastName email')
      .populate('propertyManager', 'firstName lastName email')
      .sort({ created: -1 });

    res.json({ listings: properties, count: properties.length, success: true });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ err: 'Internal server error', code: 500 });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('propertyOwner', 'firstName lastName email phoneNumber')
      .populate('propertyManager', 'firstName lastName email phoneNumber')
      .populate('currentLease.resident')
      .populate('attachments');

    if (!property) {
      return res.status(404).json({ err: 'Listing not found', code: 404 });
    }

    res.json({ listing: property, success: true });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ err: 'Internal server error', code: 500 });
  }
});

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'manager', 'owner'),
  [
    body('name').trim().notEmpty(),
    body('type').isIn(['single-family', 'multi-family', 'apartment', 'condo', 'townhouse', 'commercial']),
    body('address.street').trim().notEmpty(),
    body('address.city').trim().notEmpty(),
    body('address.state').trim().notEmpty(),
    body('address.zipCode').trim().notEmpty(),
    body('description').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const propertyCount = await Property.countDocuments();
      const propertyId = `PROP-${Date.now()}-${propertyCount + 1}`;

      const property = new Property({
        ...req.body,
        propertyId,
        owner: req.userId,
      });

      await property.save();
      await property.populate('owner', 'firstName lastName email');

      res.status(201).json({
        message: 'Property created successfully',
        property,
      });
    } catch (error) {
      console.error('Create property error:', error);
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
      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (req.user!.role !== 'admin' && property.owner.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      Object.assign(property, req.body);
      await property.save();

      res.json({
        message: 'Property updated successfully',
        property,
      });
    } catch (error) {
      console.error('Update property error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'owner'),
  async (req: AuthRequest, res) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (req.user!.role !== 'admin' && property.owner.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await property.deleteOne();

      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Delete property error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/nearby/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const nearbyProperties = await Property.find({
      _id: { $ne: property._id },
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              property.address.coordinates.lng,
              property.address.coordinates.lat,
            ],
          },
          $maxDistance: 5000,
        },
      },
    }).limit(10);

    res.json({ properties: nearbyProperties });
  } catch (error) {
    console.error('Get nearby properties error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;