import express from 'express';
import {
  getRoommates,
  getRoommateById,
  createRoommate,
  updateRoommate,
  deleteRoommate,
} from '../controllers/roommateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRoommates)
  .post(protect, createRoommate);

router.route('/:id')
  .get(getRoommateById)
  .put(protect, updateRoommate)
  .delete(protect, deleteRoommate);

export default router;