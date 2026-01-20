const Project = require('../models/Project');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { category, status, featured, search, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:slug
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('createdBy', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    // Handle images from Cloudinary upload
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        isFeatured: index === 0
      }));
    }

    const project = await Project.create(req.body);
    await project.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        isFeatured: false
      }));
      req.body.images = [...(project.images || []), ...newImages];
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    // Delete images from Cloudinary
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }
    }

    await project.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete project image
// @route   DELETE /api/projects/:id/images/:imageId
// @access  Private
exports.deleteProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    const image = project.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada'
      });
    }

    // Delete from Cloudinary
    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    image.deleteOne();
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all projects (Admin)
// @route   GET /api/projects/admin/all
// @access  Private
exports.getAllProjectsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await Project.countDocuments();
    const projects = await Project.find()
      .populate('category', 'name slug')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
