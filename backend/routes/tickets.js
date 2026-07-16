const express = require('express');
const router = express.Router();
const {
  createTicket,
  lookupTicketStatus,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  sendDirectLink
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');
const { ticketValidation, validate } = require('../middleware/validators');
const { upload } = require('../config/cloudinary');

// Public routes
router.post('/', upload.array('attachments', 5), ticketValidation, validate, createTicket);
router.get('/lookup', lookupTicketStatus);

// Protected routes
router.use(protect);

router.post('/send-direct-link', sendDirectLink);
router.get('/admin/all', getAllTickets);
router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(authorize('admin'), deleteTicket);

module.exports = router;
