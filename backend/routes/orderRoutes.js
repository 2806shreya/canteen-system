const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// student: create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount
    });

    // realtime: notify admins and this user
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('order:created', order);
      io.to(`user:${order.user}`).emit('order:updated', order);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// student: my orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get my orders error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// admin: all orders (optional ?status=)
router.get('/', auth, admin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get all orders error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// admin: update status
router.patch('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // realtime: notify admins and this user
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('order:updated', order);
      io.to(`user:${order.user}`).emit('order:updated', order);
    }

    res.json(order);
  } catch (err) {
    console.error('Update status error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
