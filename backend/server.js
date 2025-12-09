const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// store io so routes can use it
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on('join_user', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  socket.on('join_admin', () => {
    socket.join('admins');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Canteen backend is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// connect DB and start server
connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
