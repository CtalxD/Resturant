import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';

const app = express();

app.use(cors({
  origin: [
    'https://resturant-nine-taupe.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});