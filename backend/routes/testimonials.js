const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');
const { testimonialValidation, validate } = require('../middleware/validators');

// Public routes
router.get('/', getTestimonials);
router.post('/', testimonialValidation, validate, createTestimonial);

// Protected routes
router.use(protect);

router.get('/admin/all', getAllTestimonials);
router.put('/:id', updateTestimonial);
router.delete('/:id', authorize('admin'), deleteTestimonial);

module.exports = router;
