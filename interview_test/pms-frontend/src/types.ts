export interface User {
  _id: string;
  fullName: string;
  emailAddress: string;
  userRole: 'admin' | 'manager' | 'tenant' | 'owner';
  profileImage?: string;
  phoneNumber?: string;
  created: string;
  modified: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  type: 'apartment' | 'house' | 'commercial' | 'condo';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  status: 'available' | 'occupied' | 'maintenance' | 'vacant';
  images: string[];
  description?: string;
  amenities: string[];
  leaseTerms?: string;
  petPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  securityDeposit: number;
  status: 'active' | 'inactive' | 'pending' | 'terminated';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  images: string[];
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  type: 'rent' | 'deposit' | 'fee' | 'maintenance' | 'late_fee';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'check' | 'cash';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'invoice' | 'receipt' | 'insurance' | 'other';
  url: string;
  size: number;
  uploadedBy: string;
  relatedTo?: {
    type: 'property' | 'tenant' | 'maintenance';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  type: 'message' | 'notification' | 'reminder';
  isRead: boolean;
  attachments?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'showing' | 'maintenance' | 'inspection' | 'meeting';
  propertyId?: string;
  attendees: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totalProperties: number;
  totalTenants: number;
  occupancyRate: number;
  monthlyRevenue: number;
  maintenanceRequests: {
    total: number;
    pending: number;
    completed: number;
  };
  paymentStatus: {
    onTime: number;
    late: number;
    overdue: number;
  };
  propertyTypes: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
  maintenanceByCategory: { category: string; count: number }[];
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  types: {
    maintenance: boolean;
    payments: boolean;
    messages: boolean;
    reminders: boolean;
  };
}

export interface UserSettings {
  id: string;
  userId: string;
  notifications: NotificationSettings;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  result?: T;
  msg?: string;
  err?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  type?: 'text' | 'action' | 'suggestion';
}

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  type: 'property' | 'maintenance' | 'appointment';
  data: any;
}