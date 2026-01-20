const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGallery
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public route
router.get('/', getGalleryImages);

// Protected routes
router.use(protect);

router.post('/', upload.single('image'), createGalleryImage);
router.put('/reorder', reorderGallery);
router.route('/:id')
  .put(upload.single('image'), updateGalleryImage)
  .delete(authorize('admin'), deleteGalleryImage);

module.exports = router;
