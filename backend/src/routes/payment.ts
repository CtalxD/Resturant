import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { PaymentStatus } from '@prisma/client';

const router = Router();

/**
 * PROCESS ESEWA PAYMENT
 */
router.post('/process-esewa-payment', async (req: Request, res: Response) => {
  try {
    const { 
      amount, 
      orderNumber,
      esewaToken 
    } = req.body;

    console.log('📱 eSewa Payment request received:', {
      amount,
      orderNumber,
      esewaToken: esewaToken ? '***' : 'Missing',
      timestamp: new Date().toISOString()
    });

    // Basic validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment amount'
      });
    }

    if (!esewaToken) {
      return res.status(400).json({
        success: false,
        error: 'eSewa token is required'
      });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate payment reference
    const paymentReference = `ESW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Simulate eSewa payment processing (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      console.log(`✅ eSewa Payment successful: ${paymentReference}`);
      
      // Store payment in database if orderNumber is provided
      if (orderNumber && typeof orderNumber === 'string') {
        try {
          // Find the order
          const order = await prisma.order.findFirst({
            where: { orderNumber: orderNumber }
          });

          if (order) {
            // Create payment record
            const payment = await prisma.payment.create({
              data: {
                paymentReference: paymentReference,
                paymentGateway: 'esewa',
                transactionId: esewaToken,
                amount: amount,
                status: PaymentStatus.COMPLETED,
                orderId: order.id
              }
            });

            console.log(`✅ eSewa Payment record created with ID: ${payment.id}`);

            // Update order payment status to COMPLETED
            const updatedOrder = await prisma.order.update({
              where: { id: order.id },
              data: { 
                paymentStatus: PaymentStatus.COMPLETED,
                paymentReference: paymentReference
              }
            });

            console.log(`✅ Order ${orderNumber} payment status updated to: COMPLETED`);
            console.log(`✅ Order payment reference set to: ${paymentReference}`);
            
          } else {
            console.log(`⚠️ Order not found for payment update: ${orderNumber}`);
          }
        } catch (dbError) {
          console.error('❌ Database update error:', dbError);
        }
      }
      
      return res.status(200).json({
        success: true,
        paymentReference,
        message: 'eSewa payment processed successfully',
        amount: amount,
        paymentGateway: 'esewa',
        transactionDate: new Date().toISOString()
      });
    } else {
      console.log(`❌ eSewa Payment failed for amount: ${amount}`);
      
      return res.status(400).json({
        success: false,
        error: 'eSewa payment failed. Please try again.',
        errorCode: 'ESEWA_FAILED',
        declineReason: 'Transaction could not be completed'
      });
    }

  } catch (error) {
    console.error('❌ eSewa Payment processing error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while processing eSewa payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * VERIFY ESEWA PAYMENT
 */
router.post('/verify-esewa-payment', async (req: Request, res: Response) => {
  try {
    const { transactionId, amount, orderNumber } = req.body;

    console.log('🔍 Verifying eSewa payment:', {
      transactionId: transactionId ? '***' : 'Missing',
      amount,
      orderNumber
    });

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required for verification'
      });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: {
        transactionId: transactionId
      }
    });

    if (existingPayment) {
      return res.json({
        success: true,
        verified: true,
        payment: existingPayment,
        message: 'Payment already verified'
      });
    }

    // Generate payment reference for new payment
    const paymentReference = `ESW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Find and update order if orderNumber provided
    if (orderNumber) {
      const order = await prisma.order.findFirst({
        where: { orderNumber: orderNumber }
      });

      if (order) {
        // Create new payment record
        const payment = await prisma.payment.create({
          data: {
            paymentReference: paymentReference,
            paymentGateway: 'esewa',
            transactionId: transactionId,
            amount: amount || order.totalAmount,
            status: PaymentStatus.COMPLETED,
            orderId: order.id
          }
        });

        // Update order payment status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.COMPLETED,
            paymentReference: paymentReference
          }
        });

        console.log(`✅ eSewa payment verified and recorded: ${paymentReference}`);

        return res.json({
          success: true,
          verified: true,
          payment,
          message: 'Payment verified and recorded successfully'
        });
      }
    }

    return res.json({
      success: true,
      verified: true,
      paymentReference,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('❌ eSewa verification error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to verify eSewa payment'
    });
  }
});

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

    // Generate payment reference
    const paymentReference = `CSH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create cash payment record
    const payment = await prisma.payment.create({
      data: {
        paymentReference: paymentReference,
        paymentGateway: 'cash',
        amount: amount || order.totalAmount,
        status: PaymentStatus.COMPLETED,
        orderId: order.id
      }
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