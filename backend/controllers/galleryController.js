const Gallery = require('../models/Gallery');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get gallery images
// @route   GET /api/gallery
// @access  Public
exports.getGalleryImages = async (req, res) => {
  try {
    const { category, featured, limit = 20 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const images = await Gallery.find(query)
      .populate('category', 'name slug')
      .populate('project', 'title slug')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create gallery image
// @route   POST /api/gallery
// @access  Private
exports.createGalleryImage = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const gallery = await Gallery.create(req.body);
    await gallery.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private
exports.updateGalleryImage = async (req, res) => {
  try {
    let gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada'
      });
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary
      if (gallery.image.publicId) {
        await deleteImage(gallery.image.publicId);
      }
      req.body.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
exports.deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada'
      });
    }

    // Delete from Cloudinary
    if (gallery.image.publicId) {
      await deleteImage(gallery.image.publicId);
    }

    await gallery.deleteOne();

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

// @desc    Reorder gallery images
// @route   PUT /api/gallery/reorder
// @access  Private
exports.reorderGallery = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));

    await Gallery.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: 'Orden actualizado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
