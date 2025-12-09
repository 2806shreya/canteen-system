const express = require('express');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// public: get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error('Get menu error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// admin: create menu item
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const item = await MenuItem.create({ name, price, category });
    res.status(201).json(item);
  } catch (err) {
    console.error('Create menu item error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// admin: update menu item
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Update menu item error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// admin: delete menu item
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete menu item error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
