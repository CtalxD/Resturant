import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { PaymentStatus } from '@prisma/client';

const router = Router();

/**
 * CREATE CASH PAYMENT RECORD
 */
router.post('/create-cash-payment', async (req: Request, res: Response) => {
  try {
    const { orderNumber, amount } = req.body;

    console.log('💵 Cash payment record request:', {
      orderNumber,
      amount,
      timestamp: new Date().toISOString()
    });

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        error: 'Order number is required'
      });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: { orderNumber: orderNumber }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if cash payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: {
        orderId: order.id,
        paymentGateway: 'cash'
      }
    });

    if (existingPayment) {
      // Update existing cash payment
      const updatedPayment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          amount: amount || order.totalAmount,
          status: PaymentStatus.COMPLETED
        }
      });

      // Update order payment status
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.COMPLETED }
      });

      console.log(`✅ Existing cash payment updated: ${existingPayment.paymentReference}`);

      return res.status(200).json({
        success: true,
        paymentReference: existingPayment.paymentReference,
        message: 'Cash payment updated and marked as completed',
        payment: updatedPayment
      });
    }

    // Generate payment reference for new payment
    const paymentReference = `CSH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create new cash payment record
    const payment = await prisma.payment.create({
      data: {
        paymentReference: paymentReference,
        paymentGateway: 'cash',
        amount: amount || order.totalAmount,
        status: PaymentStatus.COMPLETED,
        orderId: order.id
      }
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: PaymentStatus.COMPLETED }
    });

    console.log(`✅ Cash payment record created: ${paymentReference}`);

    return res.status(200).json({
      success: true,
      paymentReference,
      message: 'Cash payment recorded successfully',
      payment
    });

  } catch (error) {
    console.error('❌ Cash payment recording error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to record cash payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET PAYMENT STATUS
 */
router.get('/payment-status/:reference', async (req: Request, res: Response) => {
  try {
    const reference = req.params.reference as string;
    
    const payment = await prisma.payment.findUnique({
      where: { paymentReference: reference },
      include: {
        order: {
          select: {
            orderNumber: true,
            totalAmount: true,
            paymentStatus: true
          }
        }
      }
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    return res.json({
      success: true,
      reference: payment.paymentReference,
      status: payment.status,
      amount: payment.amount,
      paymentGateway: payment.paymentGateway,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      order: payment.order,
      message: 'Payment retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Payment status check error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to check payment status'
    });
  }
});

/**
 * GET ALL PAYMENTS (Admin)
 */
router.get('/all-payments', async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          include: {
            customer: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📋 Retrieved ${payments.length} payments`);
    
    return res.json({
      success: true,
      payments,
      count: payments.length,
      message: 'Payment list retrieved'
    });
  } catch (error) {
    console.error('❌ Fetch payments error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch payments'
    });
  }
});

/**
 * REFUND PAYMENT (Admin)
 */
router.post('/refund/:paymentReference', async (req: Request, res: Response) => {
  try {
    const paymentReference = req.params.paymentReference as string;
    
    const payment = await prisma.payment.findUnique({
      where: { paymentReference: paymentReference }
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    if (payment.status !== PaymentStatus.COMPLETED) {
      return res.status(400).json({
        success: false,
        error: 'Only completed payments can be refunded'
      });
    }
    
    // Update payment status to REFUNDED
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.REFUNDED }
    });
    
    // Update order payment status
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: PaymentStatus.REFUNDED }
      });
    }
    
    console.log(`💰 Payment ${paymentReference} refunded successfully`);
    
    return res.json({
      success: true,
      message: 'Payment refunded successfully',
      payment: updatedPayment
    });
    
  } catch (error) {
    console.error('❌ Refund error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process refund'
    });
  }
});

export default router;