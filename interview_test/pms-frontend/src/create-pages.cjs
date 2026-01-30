const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'LandingPage', hasProps: false },
  { name: 'LoginPage', hasProps: true },
  { name: 'DashboardPage', hasProps: false },
  { name: 'PropertiesPage', hasProps: false },
  { name: 'TenantsPage', hasProps: false },
  { name: 'MaintenancePage', hasProps: false },
  { name: 'PaymentsPage', hasProps: false },
  { name: 'DocumentsPage', hasProps: false },
  { name: 'AnalyticsPage', hasProps: false },
  { name: 'MessagesPage', hasProps: false },
  { name: 'MapViewPage', hasProps: false },
  { name: 'CalendarPage', hasProps: false },
  { name: 'SettingsPage', hasProps: false }
];

const pagesDir = path.join(__dirname, 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

pages.forEach(page => {
  const filePath = path.join(pagesDir, `${page.name}.tsx`);

  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${page.name}.tsx - file already exists`);
    return;
  }

  const content = `import React from 'react';
import { motion } from 'framer-motion';

${page.hasProps ? 'interface Props {\n  onLogin: () => void;\n}\n\n' : ''}const ${page.name}: React.FC${page.hasProps ? '<Props>' : ''} = (${page.hasProps ? '{ onLogin }' : ''}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
        ${page.name.replace('Page', '')}
      </h1>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ color: '#666' }}>${page.name} content coming soon...</p>
      </div>
    </motion.div>
  );
};

export default ${page.name};
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created ${page.name}.tsx`);
});

console.log('All pages created successfully!');