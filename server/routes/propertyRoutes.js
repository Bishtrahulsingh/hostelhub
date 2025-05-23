import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  createPropertyReview,
} from '../controllers/propertyController.js';
import { protect, isOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, isOwner, createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, isOwner, updateProperty)
  .delete(protect, isOwner, deleteProperty);

router.route('/:id/reviews').post(protect, createPropertyReview);

export default router;