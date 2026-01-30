import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  propertyId: string;
  name: string;
  type: 'single-family' | 'multi-family' | 'apartment' | 'condo' | 'townhouse' | 'commercial';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  owner: mongoose.Types.ObjectId;
  manager?: mongoose.Types.ObjectId;
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  floorPlan?: string;
  virtualTour?: string;
  status: 'available' | 'occupied' | 'maintenance' | 'pending';
  details: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt: number;
    lotSize?: number;
    parkingSpaces?: number;
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  financials: {
    purchasePrice?: number;
    currentValue?: number;
    monthlyRent: number;
    securityDeposit: number;
    applicationFee?: number;
    petDeposit?: number;
    utilities: {
      water: boolean;
      electricity: boolean;
      gas: boolean;
      internet: boolean;
      trash: boolean;
      sewer: boolean;
    };
    propertyTax?: number;
    insurance?: number;
    hoa?: number;
    managementFee?: number;
  };
  lease?: {
    tenant: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    paymentDay: number;
    terms: string;
    documents: string[];
  };
  maintenance: {
    lastInspection?: Date;
    nextInspection?: Date;
    schedule: {
      hvac?: Date;
      plumbing?: Date;
      electrical?: Date;
      roof?: Date;
      exterior?: Date;
    };
    history: mongoose.Types.ObjectId[];
  };
  documents: mongoose.Types.ObjectId[];
  notes?: string;
  tags: string[];
  metrics: {
    occupancyRate: number;
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    propertyId: {
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
      enum: ['single-family', 'multi-family', 'apartment', 'condo', 'townhouse', 'commercial'],
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'USA' },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    description: {
      type: String,
      required: true,
    },
    features: [String],
    amenities: [String],
    images: [String],
    floorPlan: String,
    virtualTour: String,
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'pending'],
      default: 'available',
    },
    details: {
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      squareFeet: { type: Number, required: true },
      yearBuilt: { type: Number, required: true },
      lotSize: Number,
      parkingSpaces: Number,
      furnished: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      smokingAllowed: { type: Boolean, default: false },
    },
    financials: {
      purchasePrice: Number,
      currentValue: Number,
      monthlyRent: { type: Number, required: true },
      securityDeposit: { type: Number, required: true },
      applicationFee: Number,
      petDeposit: Number,
      utilities: {
        water: { type: Boolean, default: false },
        electricity: { type: Boolean, default: false },
        gas: { type: Boolean, default: false },
        internet: { type: Boolean, default: false },
        trash: { type: Boolean, default: false },
        sewer: { type: Boolean, default: false },
      },
      propertyTax: Number,
      insurance: Number,
      hoa: Number,
      managementFee: Number,
    },
    lease: {
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
      },
      startDate: Date,
      endDate: Date,
      rentAmount: Number,
      paymentDay: Number,
      terms: String,
      documents: [String],
    },
    maintenance: {
      lastInspection: Date,
      nextInspection: Date,
      schedule: {
        hvac: Date,
        plumbing: Date,
        electrical: Date,
        roof: Date,
        exterior: Date,
      },
      history: [{
        type: Schema.Types.ObjectId,
        ref: 'Maintenance',
      }],
    },
    documents: [{
      type: Schema.Types.ObjectId,
      ref: 'Document',
    }],
    notes: String,
    tags: [String],
    metrics: {
      occupancyRate: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      netIncome: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ 'address.coordinates': '2dsphere' });
propertySchema.index({ propertyId: 1, status: 1 });

export default mongoose.model<IProperty>('Property', propertySchema);