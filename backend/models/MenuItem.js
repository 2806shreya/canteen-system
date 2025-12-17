// models/MenuItem.js (example)

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    image: { type: String }, // <- add this
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
