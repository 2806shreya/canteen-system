// backend/routes/menuRoutes.js

const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// GET /api/menu  -> sorted by category then name
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 }); // [web:163][web:167]
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

// POST /api/menu  -> admin adds new dish
router.post("/", async (req, res) => {
  try {
    const { name, price, category, isAvailable } = req.body;

    const item = new MenuItem({
      name,
      price,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Failed to create menu item" });
  }
});

// PUT /api/menu/:id  -> admin edit dish
router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, isAvailable } = req.body;

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, category, isAvailable },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
});

// DELETE /api/menu/:id  -> admin delete dish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
});

module.exports = router;
