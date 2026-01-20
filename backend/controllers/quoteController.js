const Quote = require('../models/Quote');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Create quote request
// @route   POST /api/quotes
// @access  Public
exports.createQuote = async (req, res) => {
  try {
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      req.body.attachments = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname
      }));
    }

    const quote = await Quote.create(req.body);

    // Send notification email to admin
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Nueva solicitud de cotización - ${req.body.name}`,
      html: emailTemplates.quoteNotification(req.body)
    });

    // Send confirmation email to client
    await sendEmail({
      to: req.body.email,
      subject: 'Hemos recibido su solicitud - D&D Landscaping Pro',
      html: emailTemplates.quoteConfirmation(req.body)
    });

    res.status(201).json({
      success: true,
      data: quote,
      message: 'Solicitud de cotización enviada. Revise su email para confirmación.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all quotes (Admin)
// @route   GET /api/quotes/admin/all
// @access  Private
exports.getAllQuotes = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Quote.countDocuments(query);
    const quotes = await Quote.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: quotes,
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

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private
exports.getQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update quote
// @route   PUT /api/quotes/:id
// @access  Private
exports.updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private (Admin)
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    await quote.deleteOne();

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

// @desc    Get quote stats
// @route   GET /api/quotes/stats
// @access  Private
exports.getQuoteStats = async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Quote.countDocuments();

    res.json({
      success: true,
      data: {
        total,
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
