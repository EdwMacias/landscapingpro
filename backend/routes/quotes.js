const express = require('express');
const router = express.Router();
const {
  createQuote,
  getAllQuotes,
  getQuote,
  updateQuote,
  deleteQuote,
  getQuoteStats
} = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/auth');
const { quoteValidation, validate } = require('../middleware/validators');
const { upload } = require('../config/cloudinary');

// Public route
router.post('/', upload.array('attachments', 5), quoteValidation, validate, createQuote);

// Protected routes
router.use(protect);

router.get('/admin/all', getAllQuotes);
router.get('/stats', getQuoteStats);
router.route('/:id')
  .get(getQuote)
  .put(updateQuote)
  .delete(authorize('admin'), deleteQuote);

module.exports = router;
