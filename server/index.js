import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import roommateRoutes from './routes/roommateRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


connectDB(); 

const app = express();

app.use(cors({
  origin: process.env.ORIGIN, 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));