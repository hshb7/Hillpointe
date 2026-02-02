import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import tenantRoutes from './routes/tenant.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import paymentRoutes from './routes/payment.routes';
import documentRoutes from './routes/document.routes';
import chatbotRoutes from './routes/chatbot.routes';
import analyticsRoutes from './routes/analytics.routes';
import messageRoutes from './routes/message.routes';
import inspectionRoutes from './routes/inspection.routes';

dotenv.config();

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-management';

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  isConnected = true;
  console.log('Connected to MongoDB');
};

// Health check — before DB middleware so it always responds
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    db: isConnected ? 'connected' : 'not connected',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasSecretKey: !!process.env.SECRET_KEY,
      isVercel: !!process.env.VERCEL,
    },
  });
});

// Ensure DB is connected before handling requests
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ error: 'Database connection failed', message: err.message });
  }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/inspections', inspectionRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

export { connectDB };
export default app;
