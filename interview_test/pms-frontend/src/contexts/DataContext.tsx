import React, { createContext, useContext, useReducer } from 'react';
import type{ Property, Tenant, MaintenanceRequest, Payment, Message, Appointment } from '../types';
import type { ReactNode } from 'react';
interface DataState {
  properties: Property[];
  tenants: Tenant[];
  maintenanceRequests: MaintenanceRequest[];
  payments: Payment[];
  messages: Message[];
  appointments: Appointment[];
  loading: {
    properties: boolean;
    tenants: boolean;
    maintenance: boolean;
    payments: boolean;
    messages: boolean;
    appointments: boolean;
  };
  filters: {
    properties: any;
    tenants: any;
    maintenance: any;
    payments: any;
    messages: any;
    appointments: any;
  };
}

interface DataAction {
  type:
    | 'SET_PROPERTIES' | 'ADD_PROPERTY' | 'UPDATE_PROPERTY' | 'DELETE_PROPERTY' | 'SET_PROPERTIES_LOADING'
    | 'SET_TENANTS' | 'ADD_TENANT' | 'UPDATE_TENANT' | 'DELETE_TENANT' | 'SET_TENANTS_LOADING'
    | 'SET_MAINTENANCE' | 'ADD_MAINTENANCE' | 'UPDATE_MAINTENANCE' | 'DELETE_MAINTENANCE' | 'SET_MAINTENANCE_LOADING'
    | 'SET_PAYMENTS' | 'ADD_PAYMENT' | 'UPDATE_PAYMENT' | 'DELETE_PAYMENT' | 'SET_PAYMENTS_LOADING'
    | 'SET_MESSAGES' | 'ADD_MESSAGE' | 'UPDATE_MESSAGE' | 'DELETE_MESSAGE' | 'SET_MESSAGES_LOADING'
    | 'SET_APPOINTMENTS' | 'ADD_APPOINTMENT' | 'UPDATE_APPOINTMENT' | 'DELETE_APPOINTMENT' | 'SET_APPOINTMENTS_LOADING'
    | 'SET_FILTER' | 'CLEAR_FILTER';
  payload?: any;
}

const initialState: DataState = {
  properties: [],
  tenants: [],
  maintenanceRequests: [],
  payments: [],
  messages: [],
  appointments: [],
  loading: {
    properties: false,
    tenants: false,
    maintenance: false,
    payments: false,
    messages: false,
    appointments: false,
  },
  filters: {
    properties: {},
    tenants: {},
    maintenance: {},
    payments: {},
    messages: {},
    appointments: {},
  },
};

const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p.id !== action.payload)
      };
    case 'SET_PROPERTIES_LOADING':
      return {
        ...state,
        loading: { ...state.loading, properties: action.payload }
      };

    case 'SET_TENANTS':
      return { ...state, tenants: action.payload };
    case 'ADD_TENANT':
      return { ...state, tenants: [...state.tenants, action.payload] };
    case 'UPDATE_TENANT':
      return {
        ...state,
        tenants: state.tenants.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TENANT':
      return {
        ...state,
        tenants: state.tenants.filter(t => t.id !== action.payload)
      };
    case 'SET_TENANTS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, tenants: action.payload }
      };

    case 'SET_MAINTENANCE':
      return { ...state, maintenanceRequests: action.payload };
    case 'ADD_MAINTENANCE':
      return { ...state, maintenanceRequests: [...state.maintenanceRequests, action.payload] };
    case 'UPDATE_MAINTENANCE':
      return {
        ...state,
        maintenanceRequests: state.maintenanceRequests.map(m => m.id === action.payload.id ? action.payload : m)
      };
    case 'DELETE_MAINTENANCE':
      return {
        ...state,
        maintenanceRequests: state.maintenanceRequests.filter(m => m.id !== action.payload)
      };
    case 'SET_MAINTENANCE_LOADING':
      return {
        ...state,
        loading: { ...state.loading, maintenance: action.payload }
      };

    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(p => p.id !== action.payload)
      };
    case 'SET_PAYMENTS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, payments: action.payload }
      };

    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m => m.id === action.payload.id ? action.payload : m)
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.payload)
      };
    case 'SET_MESSAGES_LOADING':
      return {
        ...state,
        loading: { ...state.loading, messages: action.payload }
      };

    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(a => a.id !== action.payload)
      };
    case 'SET_APPOINTMENTS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, appointments: action.payload }
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: action.payload.filter
        }
      };
    case 'CLEAR_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload]: {}
        }
      };

    default:
      return state;
  }
};

interface DataContextType extends DataState {
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  setPropertiesLoading: (loading: boolean) => void;

  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (tenant: Tenant) => void;
  deleteTenant: (id: string) => void;
  setTenantsLoading: (loading: boolean) => void;

  setMaintenance: (requests: MaintenanceRequest[]) => void;
  addMaintenance: (request: MaintenanceRequest) => void;
  updateMaintenance: (request: MaintenanceRequest) => void;
  deleteMaintenance: (id: string) => void;
  setMaintenanceLoading: (loading: boolean) => void;

  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  setPaymentsLoading: (loading: boolean) => void;

  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  deleteMessage: (id: string) => void;
  setMessagesLoading: (loading: boolean) => void;

  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  setAppointmentsLoading: (loading: boolean) => void;

  setFilter: (type: string, filter: any) => void;
  clearFilter: (type: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setProperties = (properties: Property[]) => {
    dispatch({ type: 'SET_PROPERTIES', payload: properties });
  };

  const addProperty = (property: Property) => {
    dispatch({ type: 'ADD_PROPERTY', payload: property });
  };

  const updateProperty = (property: Property) => {
    dispatch({ type: 'UPDATE_PROPERTY', payload: property });
  };

  const deleteProperty = (id: string) => {
    dispatch({ type: 'DELETE_PROPERTY', payload: id });
  };

  const setPropertiesLoading = (loading: boolean) => {
    dispatch({ type: 'SET_PROPERTIES_LOADING', payload: loading });
  };

  const setTenants = (tenants: Tenant[]) => {
    dispatch({ type: 'SET_TENANTS', payload: tenants });
  };

  const addTenant = (tenant: Tenant) => {
    dispatch({ type: 'ADD_TENANT', payload: tenant });
  };

  const updateTenant = (tenant: Tenant) => {
    dispatch({ type: 'UPDATE_TENANT', payload: tenant });
  };

  const deleteTenant = (id: string) => {
    dispatch({ type: 'DELETE_TENANT', payload: id });
  };

  const setTenantsLoading = (loading: boolean) => {
    dispatch({ type: 'SET_TENANTS_LOADING', payload: loading });
  };

  const setMaintenance = (requests: MaintenanceRequest[]) => {
    dispatch({ type: 'SET_MAINTENANCE', payload: requests });
  };

  const addMaintenance = (request: MaintenanceRequest) => {
    dispatch({ type: 'ADD_MAINTENANCE', payload: request });
  };

  const updateMaintenance = (request: MaintenanceRequest) => {
    dispatch({ type: 'UPDATE_MAINTENANCE', payload: request });
  };

  const deleteMaintenance = (id: string) => {
    dispatch({ type: 'DELETE_MAINTENANCE', payload: id });
  };

  const setMaintenanceLoading = (loading: boolean) => {
    dispatch({ type: 'SET_MAINTENANCE_LOADING', payload: loading });
  };

  const setPayments = (payments: Payment[]) => {
    dispatch({ type: 'SET_PAYMENTS', payload: payments });
  };

  const addPayment = (payment: Payment) => {
    dispatch({ type: 'ADD_PAYMENT', payload: payment });
  };

  const updatePayment = (payment: Payment) => {
    dispatch({ type: 'UPDATE_PAYMENT', payload: payment });
  };

  const deletePayment = (id: string) => {
    dispatch({ type: 'DELETE_PAYMENT', payload: id });
  };

  const setPaymentsLoading = (loading: boolean) => {
    dispatch({ type: 'SET_PAYMENTS_LOADING', payload: loading });
  };

  const setMessages = (messages: Message[]) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  };

  const addMessage = (message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const updateMessage = (message: Message) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: message });
  };

  const deleteMessage = (id: string) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: id });
  };

  const setMessagesLoading = (loading: boolean) => {
    dispatch({ type: 'SET_MESSAGES_LOADING', payload: loading });
  };

  const setAppointments = (appointments: Appointment[]) => {
    dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
  };

  const addAppointment = (appointment: Appointment) => {
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
  };

  const updateAppointment = (appointment: Appointment) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
  };

  const deleteAppointment = (id: string) => {
    dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
  };

  const setAppointmentsLoading = (loading: boolean) => {
    dispatch({ type: 'SET_APPOINTMENTS_LOADING', payload: loading });
  };

  const setFilter = (type: string, filter: any) => {
    dispatch({ type: 'SET_FILTER', payload: { type, filter } });
  };

  const clearFilter = (type: string) => {
    dispatch({ type: 'CLEAR_FILTER', payload: type });
  };

  const value: DataContextType = {
    ...state,
    setProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    setPropertiesLoading,
    setTenants,
    addTenant,
    updateTenant,
    deleteTenant,
    setTenantsLoading,
    setMaintenance,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    setMaintenanceLoading,
    setPayments,
    addPayment,
    updatePayment,
    deletePayment,
    setPaymentsLoading,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    setMessagesLoading,
    setAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    setAppointmentsLoading,
    setFilter,
    clearFilter,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};