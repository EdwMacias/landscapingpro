const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  try {
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      req.body.attachments = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname
      }));
    }

    const contact = await Contact.create(req.body);

    // Send notification email
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de contacto - ${req.body.name}`,
      html: emailTemplates.contactNotification(req.body)
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all contacts (Admin)
// @route   GET /api/contact/admin/all
// @access  Private
exports.getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: contacts,
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

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Mensaje no encontrado'
      });
    }

    // Mark as read
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update contact
// @route   PUT /api/contact/:id
// @access  Private
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Mensaje no encontrado'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Mensaje no encontrado'
      });
    }

    await contact.deleteOne();

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
