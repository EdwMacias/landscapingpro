const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { contactValidation, validate } = require('../middleware/validators');
const { upload } = require('../config/cloudinary');

// Public route
router.post('/', upload.array('attachments', 5), contactValidation, validate, createContact);

// Protected routes
router.use(protect);

router.get('/admin/all', getAllContacts);
router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(authorize('admin'), deleteContact);

module.exports = router;
