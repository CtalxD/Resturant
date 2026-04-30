//backend/src/routes/orders.ts

import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { PaymentStatus } from '@prisma/client';

const router = Router();

/**
 * CREATE ORDER
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customer,
      items,
      orderType,
      paymentMethod,
      subtotal,
      tax,
      serviceCharge,
      totalAmount,
      specialInstructions,
      paymentReference,
      paymentStatus
    } = req.body;

    console.log('📝 Received order data:', {
      customer: customer?.name,
      itemsCount: items?.length,
      paymentMethod,
      totalAmount
    });

    // Validate required fields
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        error: 'Customer name and phone are required'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must have at least one item'
      });
    }

    // Generate unique order number
    const orderNumber = `QN-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

    // Determine payment status - use enum values
    let orderPaymentStatus: PaymentStatus;
    if (paymentStatus === 'PAID' || paymentReference) {
      orderPaymentStatus = PaymentStatus.COMPLETED;
    } else {
      orderPaymentStatus = PaymentStatus.PENDING;
    }

    // Find or create customer
    let customerRecord = await prisma.customer.findFirst({
      where: {
        phone: customer.phone
      }
    });

    if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
          address: customer.address || null
        }
      });
      console.log('✅ New customer created:', customerRecord.id);
    } else {
      console.log('✅ Existing customer found:', customerRecord.id);
    }

    // Create order with nested items and add-ons
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        serviceCharge: parseFloat(serviceCharge || 0),
        totalAmount: parseFloat(totalAmount),
        status: 'pending',
        orderType: orderType || 'dine-in',
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: orderPaymentStatus,
        paymentReference: paymentReference || null,
        specialInstructions: specialInstructions || null,
        customerId: customerRecord.id,
        
        items: {
          create: items.map((item: any) => ({
            itemName: item.name,
            basePrice: parseFloat(item.basePrice),
            quantity: parseInt(item.quantity),
            isVegan: item.isVegan || false,
            totalPrice: parseFloat(item.totalPrice),
            
            addOns: {
              create: (item.addOns || []).map((addOn: any) => ({
                name: addOn.name,
                price: parseFloat(addOn.price)
              }))
            }
          }))
        }
      },
      
      include: {
        customer: true,
        items: {
          include: {
            addOns: true
          }
        }
      }
    });

    console.log(`✅ Order created successfully: ${order.orderNumber}`);
    console.log(`💰 Payment status: ${order.paymentStatus}`);
    console.log(`💳 Payment method: ${order.paymentMethod}`);

    // If payment method is cash, create cash payment record
    if (paymentMethod === 'cash') {
      try {
        const cashPaymentRef = `CSH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        await prisma.payment.create({
          data: {
            paymentReference: cashPaymentRef,
            paymentGateway: 'cash',
            amount: parseFloat(totalAmount),
            status: PaymentStatus.PENDING,
            orderId: order.id
          }
        });

        console.log(`✅ Cash payment record created for order: ${orderNumber}`);
      } catch (cashError) {
        console.error('❌ Cash payment record creation error:', cashError);
      }
    }

    return res.status(201).json({
      success: true,
      orderNumber: order.orderNumber,
      order
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create order. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET ALL ORDERS
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            addOns: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Retrieved ${orders.length} orders`);

    return res.json({
      success: true,
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error('❌ Fetch orders error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

/**
 * GET SINGLE ORDER BY ORDER NUMBER
 */
router.get('/:orderNumber', async (req: Request, res: Response) => {
  try {
    const orderNumber = req.params.orderNumber as string;

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber
      },
      include: {
        customer: true,
        items: {
          include: {
            addOns: true
          }
        },
        payments: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Fetch order error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

/**
 * UPDATE ORDER STATUS
 */
router.patch('/:orderNumber/status', async (req: Request, res: Response) => {
  try {
    const orderNumber = req.params.orderNumber as string;
    const { status, paymentStatus } = req.body;

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      console.log(`📝 Updating order status to: ${status}`);
    }
    
    if (paymentStatus) {
      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'];
      if (validStatuses.includes(paymentStatus)) {
        updateData.paymentStatus = paymentStatus as PaymentStatus;
        console.log(`💰 Updating payment status to: ${paymentStatus} for order: ${orderNumber}`);
        
        // If payment status is being updated to COMPLETED, update the payment record
        if (paymentStatus === 'COMPLETED') {
          await prisma.payment.updateMany({
            where: {
              order: {
                orderNumber: orderNumber
              },
              status: {
                not: PaymentStatus.REFUNDED
              }
            },
            data: {
              status: PaymentStatus.COMPLETED
            }
          });
          console.log(`✅ Payment records updated to COMPLETED for order: ${orderNumber}`);
        }
        
        // If payment status is being updated to REFUNDED, update the payment record
        if (paymentStatus === 'REFUNDED') {
          await prisma.payment.updateMany({
            where: {
              order: {
                orderNumber: orderNumber
              },
              status: PaymentStatus.COMPLETED
            },
            data: {
              status: PaymentStatus.REFUNDED
            }
          });
          console.log(`💰 Payment records updated to REFUNDED for order: ${orderNumber}`);
        }
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment status'
        });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid update fields provided'
      });
    }

    const result = await prisma.order.updateMany({
      where: {
        orderNumber: orderNumber
      },
      data: updateData
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    console.log(`✅ Order ${orderNumber} updated successfully`);

    // Fetch updated order to return
    const updatedOrder = await prisma.order.findFirst({
      where: { orderNumber: orderNumber },
      include: {
        customer: true,
        items: {
          include: {
            addOns: true
          }
        },
        payments: true
      }
    });

    return res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ Update order error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

/**
 * GET ORDERS BY CUSTOMER PHONE
 */
router.get('/customer/:phone', async (req: Request, res: Response) => {
  try {
    const phone = req.params.phone as string;

    const orders = await prisma.order.findMany({
      where: {
        customer: {
          phone: phone
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            addOns: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      success: true,
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error('❌ Fetch customer orders error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customer orders'
    });
  }
});

export default router;