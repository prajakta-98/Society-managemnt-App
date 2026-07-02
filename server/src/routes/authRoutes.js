import { Router } from 'express';
import { getCurrentUser } from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', authenticate, getCurrentUser);

export default router;
