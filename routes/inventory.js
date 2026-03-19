const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventories with product details
router.get('/', async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory by ID with product details
router.get('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory by product ID
router.get('/product/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ product: req.params.productId }).populate('product');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add stock
router.post('/add-stock', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    if (!product || quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const inventory = await Inventory.findOne({ product }).populate('product');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

    inventory.stock += quantity;
    await inventory.save();
    
    res.json({ message: 'Stock added successfully', inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove stock
router.post('/remove-stock', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    if (!product || quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const inventory = await Inventory.findOne({ product }).populate('product');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

    if (inventory.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    inventory.stock -= quantity;
    await inventory.save();
    
    res.json({ message: 'Stock removed successfully', inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reservation - reduce stock and increase reserved
router.post('/reservation', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    if (!product || quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const inventory = await Inventory.findOne({ product }).populate('product');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

    if (inventory.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock for reservation' });
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;
    await inventory.save();
    
    res.json({ message: 'Reservation created successfully', inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sold - reduce reserved and increase soldCount
router.post('/sold', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    if (!product || quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const inventory = await Inventory.findOne({ product }).populate('product');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

    if (inventory.reserved < quantity) {
      return res.status(400).json({ error: 'Insufficient reserved quantity' });
    }

    inventory.reserved -= quantity;
    inventory.soldCount += quantity;
    await inventory.save();
    
    res.json({ message: 'Sold recorded successfully', inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
