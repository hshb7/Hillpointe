import React, { createContext, useContext, useReducer, useEffect} from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: 'AUTH_START' | 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'AUTH_LOGOUT' | 'CLEAR_ERROR';
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authApi.getCurrentUser();
          if ((response as any).ok && (response as any).currentAccount) {
            dispatch({ type: 'AUTH_SUCCESS', payload: (response as any).currentAccount});
          } else {
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid token' });
          }
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: any =await authApi.login(email, password);

      if (response.ok && response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.account });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.msg || 'Login failed' });
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Login failed'
      });
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authApi.register(userData);

      if (response.success) {
        await login(userData.emailAddress!, userData.password);
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Registration failed' });
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Registration failed'
      });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};