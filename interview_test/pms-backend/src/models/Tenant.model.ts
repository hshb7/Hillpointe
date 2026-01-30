import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  leaseStart: Date;
  leaseEnd: Date;
  monthlyRent: number;
  securityDeposit: number;
  depositPaid: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  employment: {
    employer: string;
    position: string;
    salary: number;
    startDate: Date;
    supervisorName?: string;
    supervisorPhone?: string;
  };
  references: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }>;
  vehicles: Array<{
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  }>;
  pets: Array<{
    type: string;
    breed: string;
    name: string;
    weight: number;
    vaccinated: boolean;
  }>;
  background: {
    creditScore?: number;
    criminalRecord: boolean;
    evictionHistory: boolean;
    bankruptcyHistory: boolean;
    verificationDate?: Date;
  };
  paymentHistory: Array<{
    date: Date;
    amount: number;
    type: string;
    status: 'paid' | 'pending' | 'late' | 'failed';
    paymentMethod: string;
    transactionId?: string;
  }>;
  maintenanceRequests: mongoose.Types.ObjectId[];
  documents: Array<{
    type: string;
    name: string;
    url: string;
    uploadDate: Date;
  }>;
  notes: string;
  status: 'active' | 'pending' | 'past' | 'evicted';
  moveInDate?: Date;
  moveOutDate?: Date;
  moveInCondition?: string;
  moveOutCondition?: string;
  balance: number;
  autoPayEnabled: boolean;
  preferredContactMethod: 'email' | 'phone' | 'text' | 'app';
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Properties',
      required: true,
    },
    leaseStart: {
      type: Date,
      required: true,
    },
    leaseEnd: {
      type: Date,
      required: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    depositPaid: {
      type: Boolean,
      default: false,
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
    },
    employment: {
      employer: { type: String, required: true },
      position: { type: String, required: true },
      salary: { type: Number, required: true },
      startDate: { type: Date, required: true },
      supervisorName: String,
      supervisorPhone: String,
    },
    references: [{
      name: String,
      relationship: String,
      phone: String,
      email: String,
    }],
    vehicles: [{
      make: String,
      model: String,
      year: Number,
      color: String,
      licensePlate: String,
    }],
    pets: [{
      type: String,
      breed: String,
      name: String,
      weight: Number,
      vaccinated: Boolean,
    }],
    background: {
      creditScore: Number,
      criminalRecord: { type: Boolean, default: false },
      evictionHistory: { type: Boolean, default: false },
      bankruptcyHistory: { type: Boolean, default: false },
      verificationDate: Date,
    },
    paymentHistory: [{
      date: Date,
      amount: Number,
      type: String,
      status: {
        type: String,
        enum: ['paid', 'pending', 'late', 'failed'],
      },
      paymentMethod: String,
      transactionId: String,
    }],
    maintenanceRequests: [{
      type: Schema.Types.ObjectId,
      ref: 'Maintenance',
    }],
    documents: [{
      type: String,
      name: String,
      url: String,
      uploadDate: Date,
    }],
    notes: String,
    status: {
      type: String,
      enum: ['active', 'pending', 'past', 'evicted'],
      default: 'pending',
    },
    moveInDate: Date,
    moveOutDate: Date,
    moveInCondition: String,
    moveOutCondition: String,
    balance: {
      type: Number,
      default: 0,
    },
    autoPayEnabled: {
      type: Boolean,
      default: false,
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'text', 'app'],
      default: 'email',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITenant>('Tenant', tenantSchema);