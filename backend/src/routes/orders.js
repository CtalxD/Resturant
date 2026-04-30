import { Router } from 'express';
import prisma from '../config/database.js';

const router = Router();

// Create order - Cash only
router.post('/', async (req, res) => {
  try {
    const { customer, items, orderType, subtotal, tax, serviceCharge, totalAmount, specialInstructions } = req.body;

    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ success: false, error: 'Customer name and phone are required' });
    }

    if (!items?.length) {
      return res.status(400).json({ success: false, error: 'Order must have at least one item' });
    }

    const orderNumber = `QN-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

    // Find or create customer
    let customerRecord = await prisma.customer.findFirst({ where: { phone: customer.phone } });

    if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
          address: customer.address || null
        }
      });
    } else {
      customerRecord = await prisma.customer.update({
        where: { id: customerRecord.id },
        data: {
          name: customer.name,
          email: customer.email || customerRecord.email,
          address: customer.address || customerRecord.address
        }
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        serviceCharge: parseFloat(serviceCharge || 0),
        totalAmount: parseFloat(totalAmount),
        status: 'pending',
        orderType: orderType || 'dine-in',
        paymentMethod: 'cash',
        paymentStatus: 'PENDING',
        specialInstructions: specialInstructions || null,
        customerId: customerRecord.id,
        items: {
          create: items.map(item => ({
            itemName: item.name,
            basePrice: parseFloat(item.basePrice),
            quantity: parseInt(item.quantity),
            isVegan: item.isVegan || false,
            totalPrice: parseFloat(item.totalPrice),
            addOns: {
              create: (item.addOns || []).map(addOn => ({
                name: addOn.name,
                price: parseFloat(addOn.price)
              }))
            }
          }))
        }
      },
      include: {
        customer: true,
        items: { include: { addOns: true } }
      }
    });

    // Create cash payment record
    const paymentRef = `CSH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    await prisma.payment.create({
      data: {
        paymentReference: paymentRef,
        paymentGateway: 'cash',
        amount: parseFloat(totalAmount),
        status: 'PENDING',
        orderId: order.id
      }
    });

    console.log(`✅ Order ${orderNumber} created with cash payment`);

    return res.status(201).json({ success: true, orderNumber: order.orderNumber, order });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: { include: { addOns: true } },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, orders, count: orders.length });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// Get order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { orderNumber: req.params.orderNumber },
      include: {
        customer: true,
        items: { include: { addOns: true } },
        payments: true
      }
    });

    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// Update order status
router.patch('/:orderNumber/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await prisma.order.findFirst({ where: { orderNumber: req.params.orderNumber } });

    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    const updateData = {};
    if (status) updateData.status = status;
    
    if (paymentStatus) {
      if (!['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'].includes(paymentStatus)) {
        return res.status(400).json({ success: false, error: 'Invalid payment status' });
      }
      updateData.paymentStatus = paymentStatus;
      
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: paymentStatus }
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: updateData,
      include: {
        customer: true,
        items: { include: { addOns: true } },
        payments: true
      }
    });

    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

export default router;