const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
  getAllProjectsAdmin
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { projectValidation, validate } = require('../middleware/validators');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getProjects);
router.get('/:slug', getProject);

// Protected routes
router.use(protect);

router.get('/admin/all', getAllProjectsAdmin);
router.post('/', upload.array('images', 10), projectValidation, validate, createProject);
router.put('/:id', upload.array('images', 10), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);
router.delete('/:id/images/:imageId', deleteProjectImage);

module.exports = router;
