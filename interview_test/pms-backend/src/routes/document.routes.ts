import express from 'express';
import { body, validationResult } from 'express-validator';
import DocumentModel from '../models/Document.model';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, category, property, tenant } = req.query;
    const filter: any = { isArchived: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (property) filter.property = property;
    if (tenant) filter.tenant = tenant;

    const documents = await DocumentModel.find(filter)
      .populate('property', 'name address')
      .populate('tenant')
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ documents, count: documents.length });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const document = await DocumentModel.findById(req.params.id)
      .populate('property')
      .populate('tenant')
      .populate('uploadedBy', 'firstName lastName email')
      .populate('accessControl.user', 'firstName lastName email');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('name').trim().notEmpty(),
    body('type').isIn(['lease', 'application', 'inspection', 'insurance', 'tax', 'contract', 'invoice', 'receipt', 'report', 'other']),
    body('category').isIn(['legal', 'financial', 'maintenance', 'tenant', 'property', 'administrative']),
    body('fileUrl').trim().notEmpty(),
    body('fileSize').isInt({ min: 0 }),
    body('mimeType').trim().notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const docCount = await DocumentModel.countDocuments();
      const documentId = `DOC-${Date.now()}-${docCount + 1}`;

      const document = new DocumentModel({
        ...req.body,
        documentId,
        uploadedBy: req.userId,
        audit: [{
          action: 'uploaded',
          user: req.userId,
          timestamp: new Date(),
          details: 'Document uploaded',
        }],
      });

      await document.save();
      await document.populate('uploadedBy', 'firstName lastName email');

      res.status(201).json({
        message: 'Document created successfully',
        document,
      });
    } catch (error) {
      console.error('Create document error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const document = await DocumentModel.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      Object.assign(document, req.body);
      await document.save();

      res.json({
        message: 'Document updated successfully',
        document,
      });
    } catch (error) {
      console.error('Update document error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  async (req: AuthRequest, res) => {
    try {
      const document = await DocumentModel.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      await document.deleteOne();

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
