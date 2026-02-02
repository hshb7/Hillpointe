import axios from 'axios';

type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
};

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'tenant';
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface Property {
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

interface Tenant {
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

interface MaintenanceRequest {
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

interface Payment {
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

interface Document {
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
  category?: string;
  uploadedAt?: string;
  propertyId?: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
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

interface Appointment {
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

interface AnalyticsData {
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

interface NotificationSettings {
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

interface UserSettings {
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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/signin', {
      userEmail: email,
      userPassword: password,
    });
    return response.data;
  },

  register: async (userData: Partial<User> & { password: string }): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.post('/auth/signout');
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/current-user');
    return response.data;
  },

  updateProfile: async (profileData: Record<string, any>): Promise<any> => {
    const response = await api.put('/auth/me', profileData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<any> => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

// Transform backend property shape to frontend Property type
function transformProperty(p: any): Property {
  return {
    id: p._id || p.id,
    name: p.name || '',
    address: p.address?.street || '',
    city: p.address?.city || '',
    state: p.address?.state || '',
    zipCode: p.address?.zipCode || '',
    latitude: p.address?.coordinates?.lat || 0,
    longitude: p.address?.coordinates?.lng || 0,
    type: p.type === 'single-family' || p.type === 'multi-family' || p.type === 'townhouse'
      ? 'house' : (p.type || 'apartment'),
    bedrooms: p.details?.bedrooms || 0,
    bathrooms: p.details?.bathrooms || 0,
    sqft: p.details?.squareFeet || 0,
    rent: p.financials?.monthlyRent || 0,
    status: p.status === 'pending' ? 'vacant' : (p.status || 'available'),
    images: p.images || [],
    description: p.description,
    amenities: p.amenities || [],
    leaseTerms: p.lease?.terms,
    petPolicy: p.details?.petsAllowed ? 'Pets allowed' : 'No pets',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// Transform backend tenant shape to frontend Tenant type
function transformTenant(t: any): Tenant {
  return {
    id: t._id || t.id,
    userId: t.user?._id || t.user || '',
    propertyId: t.property?._id || t.property || '',
    leaseStart: t.leaseStart,
    leaseEnd: t.leaseEnd,
    rentAmount: t.monthlyRent || 0,
    securityDeposit: t.securityDeposit || 0,
    status: t.status === 'past' ? 'inactive' : (t.status || 'pending'),
    emergencyContact: t.emergencyContact ? {
      name: t.emergencyContact.name || '',
      phone: t.emergencyContact.phone || '',
      relationship: t.emergencyContact.relationship || '',
    } : undefined,
    documents: [],
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

// Transform backend maintenance shape to frontend MaintenanceRequest type
function transformMaintenance(m: any): MaintenanceRequest {
  const statusMap: Record<string, string> = {
    'in-progress': 'in_progress',
    'on-hold': 'assigned',
    'cancelled': 'cancelled',
  };
  const priorityMap: Record<string, string> = {
    'emergency': 'urgent',
  };
  return {
    id: m._id || m.id,
    propertyId: m.property?._id || m.property || '',
    tenantId: m.tenant?._id || m.tenant || '',
    title: m.title || '',
    description: m.description || '',
    priority: (priorityMap[m.priority] || m.priority || 'medium') as MaintenanceRequest['priority'],
    category: m.category || 'other',
    status: (statusMap[m.status] || m.status || 'pending') as MaintenanceRequest['status'],
    assignedTo: m.assignedTo?._id || m.assignedTo,
    images: m.images || [],
    cost: m.actualCost || m.estimatedCost,
    notes: m.notes?.[m.notes.length - 1]?.content,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    completedAt: m.completedDate,
  };
}

// Transform backend payment shape to frontend Payment type
function transformPayment(p: any): Payment {
  const statusMap: Record<string, string> = {
    'paid': 'completed',
    'partial': 'pending',
    'late': 'pending',
  };
  const typeMap: Record<string, string> = {
    'late-fee': 'late_fee',
    'utility': 'fee',
  };
  return {
    id: p._id || p.id,
    tenantId: p.tenant?._id || p.tenant || '',
    propertyId: p.property?._id || p.property || '',
    amount: p.amount || 0,
    type: (typeMap[p.type] || p.type || 'rent') as Payment['type'],
    status: (statusMap[p.status] || p.status || 'pending') as Payment['status'],
    dueDate: p.dueDate,
    paidDate: p.paidDate,
    paymentMethod: p.method,
    description: p.description,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// Transform backend user shape to match frontend User expectations
export function transformUser(u: any): { _id: string; fullName: string; emailAddress: string; userRole: string; phoneNumber?: string; profileImage?: string; created: string; modified: string } {
  return {
    _id: u._id || u.id,
    fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
    emailAddress: u.email || '',
    userRole: u.role || 'tenant',
    phoneNumber: u.phoneNumber,
    profileImage: u.avatar,
    created: u.createdAt,
    modified: u.updatedAt,
  };
}

export const propertiesApi = {
  getAll: async (params?: FilterParams): Promise<{ data: Property[]; total: number }> => {
    const response = await api.get('/properties', { params });
    const raw = response.data;
    const listings = raw.listings || raw.data || [];
    return {
      data: listings.map(transformProperty),
      total: raw.count || listings.length,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Property>> => {
    const response: AxiosResponse<ApiResponse<Property>> = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (propertyData: Partial<Property>): Promise<ApiResponse<Property>> => {
    const response: AxiosResponse<ApiResponse<Property>> = await api.post('/properties', propertyData);
    return response.data;
  },

  update: async (id: string, propertyData: Partial<Property>): Promise<ApiResponse<Property>> => {
    const response: AxiosResponse<ApiResponse<Property>> = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/properties/${id}`);
    return response.data;
  },

  uploadImages: async (id: string, images: File[]): Promise<ApiResponse<string[]>> => {
    const formData = new FormData();
    images.forEach((image) => formData.append('files', image));
    const response: AxiosResponse<ApiResponse<string[]>> = await api.post(`/properties/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const tenantsApi = {
  getAll: async (params?: FilterParams): Promise<{ data: Tenant[]; total: number; populatedUsers: any[] }> => {
    const response = await api.get('/tenants', { params });
    const raw = response.data;
    const tenants = raw.tenantData || raw.data || [];
    // Extract populated user objects from raw tenant data
    const userMap = new Map<string, any>();
    tenants.forEach((t: any) => {
      if (t.user && t.user._id) {
        userMap.set(t.user._id, transformUser(t.user));
      }
    });
    return {
      data: tenants.map(transformTenant),
      total: raw.count || tenants.length,
      populatedUsers: Array.from(userMap.values()),
    };
  },

  getById: async (id: string): Promise<ApiResponse<Tenant>> => {
    const response: AxiosResponse<ApiResponse<Tenant>> = await api.get(`/tenants/${id}`);
    return response.data;
  },

  create: async (tenantData: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    const response: AxiosResponse<ApiResponse<Tenant>> = await api.post('/tenants', tenantData);
    return response.data;
  },

  update: async (id: string, tenantData: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    const response: AxiosResponse<ApiResponse<Tenant>> = await api.put(`/tenants/${id}`, tenantData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/tenants/${id}`);
    return response.data;
  },
};

export const maintenanceApi = {
  getAll: async (params?: FilterParams): Promise<{ data: MaintenanceRequest[]; total: number }> => {
    const response = await api.get('/maintenance', { params });
    const raw = response.data;
    const requests = raw.requests || raw.data || [];
    return {
      data: requests.map(transformMaintenance),
      total: raw.totalCount || requests.length,
    };
  },

  getById: async (id: string): Promise<ApiResponse<MaintenanceRequest>> => {
    const response: AxiosResponse<ApiResponse<MaintenanceRequest>> = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (requestData: Partial<MaintenanceRequest>): Promise<ApiResponse<MaintenanceRequest>> => {
    const response: AxiosResponse<ApiResponse<MaintenanceRequest>> = await api.post('/maintenance', requestData);
    return response.data;
  },

  update: async (id: string, requestData: Partial<MaintenanceRequest>): Promise<ApiResponse<MaintenanceRequest>> => {
    const response: AxiosResponse<ApiResponse<MaintenanceRequest>> = await api.patch(`/maintenance/${id}`, requestData);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<MaintenanceRequest>> => {
    const response: AxiosResponse<ApiResponse<MaintenanceRequest>> = await api.patch(`/maintenance/${id}`, { newStatus: status });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/maintenance/${id}`);
    return response.data;
  },
};

export const paymentsApi = {
  getAll: async (params?: FilterParams): Promise<{ data: Payment[]; total: number }> => {
    const response = await api.get('/payments', { params });
    const raw = response.data;
    const payments = raw.paymentList || raw.data || [];
    return {
      data: payments.map(transformPayment),
      total: raw.paymentCount || payments.length,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    const response: AxiosResponse<ApiResponse<Payment>> = await api.get(`/payments/${id}`);
    return response.data;
  },

  create: async (paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    const response: AxiosResponse<ApiResponse<Payment>> = await api.post('/payments', paymentData);
    return response.data;
  },

  update: async (id: string, paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    const response: AxiosResponse<ApiResponse<Payment>> = await api.patch(`/payments/${id}`, paymentData);
    return response.data;
  },

  processPayment: async (id: string, paymentMethod: string): Promise<ApiResponse<Payment>> => {
    const response: AxiosResponse<ApiResponse<Payment>> = await api.post(`/payments/${id}/execute`, { method: paymentMethod });
    return response.data;
  },
};

// Transform backend document shape to frontend Document type
function transformDocument(d: any): Document {
  const uploaderName = d.uploadedBy
    ? (typeof d.uploadedBy === 'object'
      ? `${d.uploadedBy.firstName || ''} ${d.uploadedBy.lastName || ''}`.trim()
      : String(d.uploadedBy))
    : 'Unknown';

  // Map backend category to display-friendly category
  const categoryMap: Record<string, string> = {
    legal: 'Legal',
    financial: 'Financial',
    maintenance: 'Maintenance',
    tenant: 'Screening',
    property: 'Marketing',
    administrative: 'Administrative',
  };

  return {
    id: d._id || d.id,
    name: d.name || '',
    type: (['lease', 'invoice', 'receipt', 'insurance'].includes(d.type) ? d.type : 'other') as Document['type'],
    url: d.fileUrl || '',
    size: d.fileSize || 0,
    uploadedBy: uploaderName,
    relatedTo: d.property ? { type: 'property', id: d.property._id || d.property } :
               d.tenant ? { type: 'tenant', id: d.tenant._id || d.tenant } : undefined,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    // Extra fields used by DocumentsPage
    category: categoryMap[d.category] || d.category || 'Other',
    uploadedAt: d.createdAt,
    propertyId: d.property?._id || d.property,
    tenantId: d.tenant?._id || d.tenant,
  };
}

export const documentsApi = {
  getAll: async (params?: FilterParams): Promise<{ data: Document[]; total: number }> => {
    const response = await api.get('/documents', { params });
    const raw = response.data;
    const documents = raw.documents || raw.data || [];
    return {
      data: documents.map(transformDocument),
      total: raw.count || documents.length,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Document>> => {
    const response: AxiosResponse<ApiResponse<Document>> = await api.get(`/documents/${id}`);
    return response.data;
  },

  create: async (docData: { name: string; type: string; category: string; fileUrl: string; fileSize: number; mimeType: string; description?: string; property?: string; tenant?: string }): Promise<any> => {
    const response = await api.post('/documents', docData);
    return response.data;
  },

  upload: async (file: File, metadata: Partial<Document>): Promise<ApiResponse<Document>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    const response: AxiosResponse<ApiResponse<Document>> = await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/documents/${id}`);
    return response.data;
  },

  download: async (id: string): Promise<Blob> => {
    const response: AxiosResponse<Blob> = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const messagesApi = {
  getAll: async (params?: FilterParams): Promise<PaginatedResponse<Message>> => {
    const response: AxiosResponse<PaginatedResponse<Message>> = await api.get('/messages', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Message>> => {
    const response: AxiosResponse<ApiResponse<Message>> = await api.get(`/messages/${id}`);
    return response.data;
  },

  send: async (messageData: Partial<Message>): Promise<ApiResponse<Message>> => {
    const response: AxiosResponse<ApiResponse<Message>> = await api.post('/messages', messageData);
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Message>> => {
    const response: AxiosResponse<ApiResponse<Message>> = await api.patch(`/messages/${id}/read`);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/messages/${id}`);
    return response.data;
  },
};

export const appointmentsApi = {
  getAll: async (params?: FilterParams): Promise<PaginatedResponse<Appointment>> => {
    const response: AxiosResponse<PaginatedResponse<Appointment>> = await api.get('/appointments', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Appointment>> => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await api.post('/appointments', appointmentData);
    return response.data;
  },

  update: async (id: string, appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export const analyticsApi = {
  getDashboardData: async (): Promise<ApiResponse<AnalyticsData>> => {
    const response: AxiosResponse<ApiResponse<AnalyticsData>> = await api.get('/analytics/dashboard');
    return response.data;
  },

  getRevenueReport: async (startDate: string, endDate: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get('/analytics/revenue', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getOccupancyReport: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get('/analytics/occupancy');
    return response.data;
  },

  getMaintenanceReport: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get('/analytics/maintenance');
    return response.data;
  },
};

export const settingsApi = {
  getUserSettings: async (): Promise<ApiResponse<UserSettings>> => {
    const response: AxiosResponse<ApiResponse<UserSettings>> = await api.get('/settings');
    return response.data;
  },

  updateUserSettings: async (settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> => {
    const response: AxiosResponse<ApiResponse<UserSettings>> = await api.put('/settings', settings);
    return response.data;
  },
};

export default api;