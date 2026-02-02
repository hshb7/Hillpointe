import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  ticketId: string;
  property: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'landscaping' | 'pest' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  title: string;
  description: string;
  location: string;
  images: string[];
  scheduledDate?: Date;
  completedDate?: Date;
  estimatedCost?: number;
  actualCost?: number;
  vendor?: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  notes: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
  }>;
  timeline: Array<{
    status: string;
    timestamp: Date;
    user: mongoose.Types.ObjectId;
    comment?: string;
  }>;
  materials: Array<{
    item: string;
    quantity: number;
    cost: number;
  }>;
  laborHours?: number;
  recurringSchedule?: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDate: Date;
  };
  satisfaction?: {
    rating: number;
    feedback: string;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      enum: ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'landscaping', 'pest', 'other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
      default: 'pending',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [String],
    scheduledDate: Date,
    completedDate: Date,
    estimatedCost: Number,
    actualCost: Number,
    vendor: {
      name: String,
      company: String,
      phone: String,
      email: String,
    },
    notes: [{
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      content: String,
      timestamp: Date,
    }],
    timeline: [{
      status: String,
      timestamp: Date,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
    }],
    materials: [{
      item: String,
      quantity: Number,
      cost: Number,
    }],
    laborHours: Number,
    recurringSchedule: {
      frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
      },
      nextDate: Date,
    },
    satisfaction: {
      rating: Number,
      feedback: String,
      date: Date,
    },
  },
  {
    timestamps: true,
  }
);

maintenanceSchema.index({ property: 1, status: 1 });

export default mongoose.model<IMaintenance>('Maintenance', maintenanceSchema);