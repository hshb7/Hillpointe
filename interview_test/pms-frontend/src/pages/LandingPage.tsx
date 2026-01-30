import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building, Shield, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Building size={24} />,
      title: 'Property Management',
      description: 'Efficiently manage all your properties from a single dashboard with comprehensive tools.',
    },
    {
      icon: <Users size={24} />,
      title: 'Tenant Portal',
      description: 'Provide tenants with easy access to payments, maintenance requests, and communications.',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Analytics & Reports',
      description: 'Get detailed insights into your portfolio performance with advanced analytics.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Reliable',
      description: 'Bank-level security ensures your data is always protected and accessible.',
    },
  ];

  const benefits = [
    'Streamline property operations',
    'Reduce administrative overhead',
    'Improve tenant satisfaction',
    'Increase revenue efficiency',
    'Real-time performance tracking',
    'Automated payment processing',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-stone-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center">
                <Building size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyMS</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Simplify Your{' '}
                <span className="text-emerald-800">Property</span>
                <br />
                Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Streamline operations, improve tenant satisfaction, and maximize your property portfolio's
                potential with our comprehensive management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16"
            >
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop"
                alt="Property Management Dashboard"
                className="rounded-2xl shadow-2xl mx-auto max-w-5xl w-full border border-gray-200"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to efficiently manage your property portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-800">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Property Managers Choose Us
              </h2>
              <p className="text-emerald-100 text-lg mb-8">
                Join thousands of property managers who have transformed their operations
                and increased their efficiency with our platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle size={20} className="text-emerald-300" />
                    <span className="text-white">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                alt="Property Management Benefits"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Property Management?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your free trial today and see why thousands of property managers trust us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />}>
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center">
                <Building size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyMS</span>
            </div>
            <p className="text-gray-600">
              © 2024 PropertyMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;