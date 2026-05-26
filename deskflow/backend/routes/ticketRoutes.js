import express from 'express';
import {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  getTicketStats
} from '../controllers/ticketController.js';

const router = express.Router();

// Define stats route BEFORE /:id to prevent 'stats' being treated as an id
router.get('/stats', getTicketStats);

router.post('/', createTicket);
router.get('/', getTickets);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
