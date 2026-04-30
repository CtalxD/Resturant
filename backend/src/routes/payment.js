import { Router } from 'express';
import prisma from '../config/database.js';

const router = Router();

// Process cash payment
router.post('/cash', async (req, res) => {
  try {
    const { orderNumber, amount } = req.body;

    if (!orderNumber) return res.status(400).json({ success: false, error: 'Order number required' });

    const order = await prisma.order.findFirst({ where: { orderNumber } });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    // Check existing payment
    const existing = await prisma.payment.findFirst({
      where: { orderId: order.id, paymentGateway: 'cash' }
    });

    if (existing) {
      await prisma.payment.update({
        where: { id: existing.id },
        data: { status: 'COMPLETED', amount: amount || order.totalAmount }
      });
    } else {
      const ref = `CSH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await prisma.payment.create({
        data: {
          paymentReference: ref,
          paymentGateway: 'cash',
          amount: amount || order.totalAmount,
          status: 'COMPLETED',
          orderId: order.id
        }
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'COMPLETED' }
    });

    return res.json({ success: true, message: 'Payment processed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Payment processing failed' });
  }
});

// Get payment by reference
router.get('/:reference', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { paymentReference: req.params.reference },
      include: { order: { select: { orderNumber: true, totalAmount: true, paymentStatus: true } } }
    });

    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

    return res.json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch payment' });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { order: { include: { customer: { select: { name: true, phone: true } } } } },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, payments, count: payments.length });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
});

export default router;