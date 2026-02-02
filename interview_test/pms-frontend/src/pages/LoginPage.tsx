import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from '../components/ui';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading, error, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center">
                <Building size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PropertyMS</h1>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            </div>
          </div>

          <Card padding="lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                placeholder="Enter your email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock size={16} />}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-800 hover:text-emerald-900 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-emerald-800 hover:text-emerald-900"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin:</span>
                  <span className="text-gray-900">admin@demo.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager:</span>
                  <span className="text-gray-900">manager@demo.com / manager123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenant:</span>
                  <span className="text-gray-900">tenant@demo.com / tenant123</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;