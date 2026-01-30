import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  MapPin,
  Tool,
  CreditCard,
  BarChart3,
  MessageSquare,
  Shield,
  Check,
  ArrowRight
} from 'lucide-react';

const ModernLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Home, title: 'Property Management', desc: 'Manage all your properties in one place' },
    { icon: Users, title: 'Tenant Portal', desc: 'Streamline tenant communication' },
    { icon: MapPin, title: 'Interactive Maps', desc: 'Visualize property locations' },
    { icon: Tool, title: 'Maintenance Tracking', desc: 'Never miss a repair request' },
    { icon: CreditCard, title: 'Payment Processing', desc: 'Secure rent collection' },
    { icon: BarChart3, title: 'Analytics', desc: 'Data-driven insights' }
  ];

  const benefits = [
    'Reduce vacancy rates by 40%',
    'Save 10+ hours per week',
    'Increase tenant satisfaction',
    '24/7 AI-powered support'
  ];

  return (
    <div className="min-h-screen bg-white">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-neutral-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8" style={{ color: '#2d5a41' }} />
              <span className="text-xl font-bold" style={{ color: '#2d5a41' }}>PropertyPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#2d5a41' }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6" style={{ color: '#262626' }}>
              Modern Property<br />
              Management Made
              <span style={{ color: '#2d5a41' }}> Simple</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
              Streamline operations, enhance tenant experiences, and maximize
              your property portfolio with our all-in-one platform.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-lg text-white text-lg font-medium shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                style={{ backgroundColor: '#2d5a41' }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg bg-neutral-100 text-neutral-700 text-lg font-medium hover:bg-neutral-200 transition-all"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { value: '10,000+', label: 'Properties Managed' },
              { value: '50,000+', label: 'Happy Tenants' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'Customer Rating' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#2d5a41' }}>
                  {stat.value}
                </div>
                <div className="text-neutral-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#262626' }}>
              Everything You Need
            </h2>
            <p className="text-xl text-neutral-600">
              Powerful features to manage properties effortlessly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <feature.icon
                  className="w-12 h-12 mb-4"
                  style={{ color: '#b89a7e' }}
                />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#262626' }}>
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8" style={{ color: '#262626' }}>
                Why Choose PropertyPro?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Check
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: '#2d5a41' }}
                    />
                    <span className="text-lg text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="mt-8 px-8 py-4 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: '#b89a7e' }}
              >
                Get Started Today
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-10"
                style={{ backgroundColor: '#2d5a41' }}
              />
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Property"
                className="rounded-2xl shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#2d5a41' }}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Property Management?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of property managers who trust PropertyPro
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white rounded-lg text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
              style={{ color: '#2d5a41' }}
            >
              Start Your Free 30-Day Trial
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-neutral-400">
          <p>&copy; 2024 PropertyPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ModernLandingPage;