import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './database/db.js';
import initializeUserRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create an HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Initialize Routes with io instance
app.use('/api/users',initializeUserRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  // Join the user to their own room for private messaging
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
