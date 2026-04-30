import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://resturant-nine-taupe.vercel.app/',  // Frontend
    'http://localhost:3001',  // Staff Panel
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Queens Eatery API is running'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Queens Eatery Backend running on http://localhost:${PORT}`);
  console.log(`📋 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`💳 Payment API: http://localhost:${PORT}/api/payment`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});