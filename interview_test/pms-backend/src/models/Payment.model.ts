import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  property: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  type: 'rent' | 'deposit' | 'late-fee' | 'maintenance' | 'utility' | 'other';
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'partial' | 'late' | 'failed' | 'refunded';
  method?: 'cash' | 'check' | 'credit-card' | 'debit-card' | 'ach' | 'wire' | 'online' | 'other';
  transactionId?: string;
  processingFee?: number;
  lateFee?: number;
  description: string;
  invoice?: {
    number: string;
    items: Array<{
      description: string;
      amount: number;
      quantity: number;
    }>;
    tax?: number;
    total: number;
  };
  receipt?: {
    url: string;
    sentDate?: Date;
  };
  bankDetails?: {
    accountLast4?: string;
    routingNumber?: string;
    bankName?: string;
  };
  cardDetails?: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  recurring?: {
    enabled: boolean;
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDate?: Date;
    endDate?: Date;
  };
  splitPayment?: {
    totalParts: number;
    currentPart: number;
    remainingAmount: number;
  };
  notes?: string;
  reminders: Array<{
    sentDate: Date;
    method: 'email' | 'sms' | 'app';
    status: 'sent' | 'failed';
  }>;
  disputes?: Array<{
    date: Date;
    reason: string;
    status: 'open' | 'resolved' | 'escalated';
    resolution?: string;
  }>;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Properties',
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenants',
      required: true,
    },
    type: {
      type: String,
      enum: ['rent', 'deposit', 'late-fee', 'maintenance', 'utility', 'other'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'late', 'failed', 'refunded'],
      default: 'pending',
    },
    method: {
      type: String,
      enum: ['cash', 'check', 'credit-card', 'debit-card', 'ach', 'wire', 'online', 'other'],
    },
    transactionId: String,
    processingFee: Number,
    lateFee: Number,
    description: {
      type: String,
      required: true,
    },
    invoice: {
      number: String,
      items: [{
        description: String,
        amount: Number,
        quantity: Number,
      }],
      tax: Number,
      total: Number,
    },
    receipt: {
      url: String,
      sentDate: Date,
    },
    bankDetails: {
      accountLast4: String,
      routingNumber: String,
      bankName: String,
    },
    cardDetails: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number,
    },
    recurring: {
      enabled: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
      },
      nextDate: Date,
      endDate: Date,
    },
    splitPayment: {
      totalParts: Number,
      currentPart: Number,
      remainingAmount: Number,
    },
    notes: String,
    reminders: [{
      sentDate: Date,
      method: {
        type: String,
        enum: ['email', 'sms', 'app'],
      },
      status: {
        type: String,
        enum: ['sent', 'failed'],
      },
    }],
    disputes: [{
      date: Date,
      reason: String,
      status: {
        type: String,
        enum: ['open', 'resolved', 'escalated'],
      },
      resolution: String,
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ property: 1, tenant: 1, status: 1 });
paymentSchema.index({ dueDate: 1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);