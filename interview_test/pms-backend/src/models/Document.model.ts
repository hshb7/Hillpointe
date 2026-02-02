import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  documentId: string;
  name: string;
  type: 'lease' | 'application' | 'inspection' | 'insurance' | 'tax' | 'contract' | 'invoice' | 'receipt' | 'report' | 'other';
  category: 'legal' | 'financial' | 'maintenance' | 'tenant' | 'property' | 'administrative';
  property?: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  tags: string[];
  version: number;
  previousVersions: Array<{
    version: number;
    fileUrl: string;
    uploadDate: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }>;
  expiryDate?: Date;
  reminderDate?: Date;
  isConfidential: boolean;
  accessControl: Array<{
    user: mongoose.Types.ObjectId;
    permission: 'view' | 'edit' | 'delete';
    accessCount: number;
  }>;
  signatures: Array<{
    user: mongoose.Types.ObjectId;
    signedDate: Date;
    ipAddress: string;
    signature: string;
  }>;
  audit: Array<{
    action: 'uploaded' | 'viewed' | 'downloaded' | 'edited' | 'deleted' | 'shared';
    user: mongoose.Types.ObjectId;
    timestamp: Date;
    details?: string;
  }>;
  isArchived: boolean;
  archivedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    documentId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['lease', 'application', 'inspection', 'insurance', 'tax', 'contract', 'invoice', 'receipt', 'report', 'other'],
      required: true,
    },
    category: {
      type: String,
      enum: ['legal', 'financial', 'maintenance', 'tenant', 'property', 'administrative'],
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    description: String,
    tags: [String],
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [{
      version: Number,
      fileUrl: String,
      uploadDate: Date,
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    expiryDate: Date,
    reminderDate: Date,
    isConfidential: {
      type: Boolean,
      default: false,
    },
    accessControl: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      permission: {
        type: String,
        enum: ['view', 'edit', 'delete'],
      },
    }],
    signatures: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      signedDate: Date,
      ipAddress: String,
      signature: String,
    }],

    audit: [{
      action: {
        type: String,
        enum: ['uploaded', 'viewed', 'downloaded', 'edited', 'deleted', 'shared'],
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      timestamp: Date,
      details: String,
    }],
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedDate: Date,
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ documentId: 1 });
documentSchema.index({ property: 1, type: 1 });
documentSchema.index({ tenant: 1 });

export default mongoose.model<IDocument>('Document', documentSchema);