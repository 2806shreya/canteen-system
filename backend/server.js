// backend/server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// routes
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ----- middleware -----
app.use(cors());                    // allow frontend to call backend
app.use(express.json());            // parse JSON request bodies

// serve static images: /images/fried-rice.jpg -> backend/images/fried-rice.jpg
app.use("/images", express.static(path.join(__dirname, "images"))); // [web:425][web:430]

// ----- API routes -----
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// simple health check
app.get("/", (req, res) => {
  res.json({ message: "Canteen API running" });
});

// ----- connect DB and start server -----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
