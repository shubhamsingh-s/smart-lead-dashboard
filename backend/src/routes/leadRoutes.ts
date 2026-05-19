import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} from '../controllers/leadController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(adminOnly, deleteLead);

export default router;
