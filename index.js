import express from 'express';
import connectDB from './database/db.js';
import userRoutes from './Routes/userRoutes.js';
// import createBlog from './Routes/userRoutes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); 
connectDB();

app.use(cookieParser());

// Connect to MongoDB

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/blog', createBlog);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
