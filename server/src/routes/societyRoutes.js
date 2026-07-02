import { Router } from 'express';
import {
  createSociety,
  listSocieties,
} from '../controllers/societyController.js';
import authenticate from '../middleware/authMiddleware.js';
import allowRoles from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', listSocieties);
router.post('/', authenticate, allowRoles('admin', 'committee'), createSociety);

export default router;
