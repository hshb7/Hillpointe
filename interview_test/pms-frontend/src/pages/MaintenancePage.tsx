import React from 'react';
import { motion } from 'framer-motion';

const MaintenancePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
        Maintenance
      </h1>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ color: '#666' }}>MaintenancePage content coming soon...</p>
      </div>
    </motion.div>
  );
};

export default MaintenancePage;
