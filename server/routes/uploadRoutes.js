import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post('/', protect, upload.single('image'), uploadImage);

export default router; 