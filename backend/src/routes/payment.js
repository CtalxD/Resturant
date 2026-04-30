import { Router } from 'express';
import prisma from '../config/database.js';

const router = Router();

router.post('/create-cash-payment', async (req, res) => {
  try {
    const { orderNumber, amount } = req.body;

    if (!orderNumber) {
      return res.status(400).json({ success: false, error: 'Order number is required' });
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: { orderId: order.id, paymentGateway: 'cash' }
    });

    if (existingPayment) {
      const updatedPayment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { amount: amount || order.totalAmount, status: 'COMPLETED' }
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'COMPLETED' }
      });

      return res.json({
        success: true,
        paymentReference: existingPayment.paymentReference,
        message: 'Cash payment updated',
        payment: updatedPayment
      });
    }

    const paymentReference = `CSH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        paymentReference,
        paymentGateway: 'cash',
        amount: amount || order.totalAmount,
        status: 'COMPLETED',
        orderId: order.id
      }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'COMPLETED' }
    });

    return res.json({
      success: true,
      paymentReference,
      message: 'Cash payment recorded',
      payment
    });
  } catch (error) {
    console.error('❌ Cash payment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to record cash payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/payment-status/:reference', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { paymentReference: req.params.reference },
      include: { order: { select: { orderNumber: true, totalAmount: true, paymentStatus: true } } }
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    return res.json({ success: true, ...payment });
  } catch (error) {
    console.error('❌ Payment status error:', error);
    return res.status(500).json({ success: false, error: 'Failed to check payment status' });
  }
});

router.get('/all-payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { order: { include: { customer: { select: { name: true, phone: true } } } } },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, payments, count: payments.length });
  } catch (error) {
    console.error('❌ Fetch payments error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
});

router.post('/refund/:paymentReference', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { paymentReference: req.params.paymentReference }
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    if (payment.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, error: 'Only completed payments can be refunded' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' }
    });

    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'REFUNDED' }
      });
    }

    return res.json({ success: true, message: 'Payment refunded', payment: updatedPayment });
  } catch (error) {
    console.error('❌ Refund error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process refund' });
  }
});

export default router;