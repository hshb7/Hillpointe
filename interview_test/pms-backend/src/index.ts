import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET'],
  },
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-management';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

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

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('maintenance_update', (data) => {
    io.emit('maintenance_status_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});