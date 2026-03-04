const crypto = require('crypto');
const SurveyLink = require('../models/SurveyLink');
const Quote = require('../models/Quote');
const Testimonial = require('../models/Testimonial');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Generate survey link for a quote and send email to client
// @route   POST /api/surveys/generate/:quoteId
// @access  Protected
exports.generateSurveyLink = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const surveyLink = await SurveyLink.create({
      token,
      quote: quote._id,
      clientName: quote.name,
      clientEmail: quote.email,
      expiresAt,
      sentAt: new Date()
    });

    const surveyUrl = `${process.env.FRONTEND_URL}/survey/${token}`;

    await sendEmail({
      to: quote.email,
      subject: 'We\'d love your feedback! — D&D Landscaping Pro',
      html: emailTemplates.surveyInvitation({
        clientName: quote.name,
        serviceType: quote.serviceType,
        surveyUrl,
        expiresAt
      })
    });

    res.status(201).json({
      success: true,
      data: surveyLink
    });
  } catch (error) {
    console.error('Error generating survey link:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Validate survey token (public)
// @route   GET /api/surveys/:token
// @access  Public
exports.validateSurveyToken = async (req, res) => {
  try {
    const surveyLink = await SurveyLink.findOne({ token: req.params.token }).populate('quote', 'serviceType');

    if (!surveyLink) {
      return res.status(404).json({ success: false, error: 'Survey link not found' });
    }

    if (surveyLink.status === 'completed') {
      return res.status(410).json({ success: false, error: 'already_completed', message: 'You have already responded to this survey' });
    }

    if (surveyLink.expiresAt < new Date()) {
      surveyLink.status = 'expired';
      await surveyLink.save();
      return res.status(410).json({ success: false, error: 'expired', message: 'This survey link has expired' });
    }

    res.json({
      success: true,
      data: {
        clientName: surveyLink.clientName,
        clientEmail: surveyLink.clientEmail,
        quoteServiceType: surveyLink.quote?.serviceType
      }
    });
  } catch (error) {
    console.error('Error validating survey token:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Submit survey response (public)
// @route   POST /api/surveys/:token
// @access  Public
exports.submitSurvey = async (req, res) => {
  try {
    const surveyLink = await SurveyLink.findOne({ token: req.params.token });

    if (!surveyLink) {
      return res.status(404).json({ success: false, error: 'Survey link not found' });
    }

    if (surveyLink.status === 'completed') {
      return res.status(410).json({ success: false, error: 'already_completed', message: 'You have already responded to this survey' });
    }

    if (surveyLink.expiresAt < new Date()) {
      surveyLink.status = 'expired';
      await surveyLink.save();
      return res.status(410).json({ success: false, error: 'expired', message: 'This survey link has expired' });
    }

    const { name, rating, content, location } = req.body;

    if (!name || !rating || !content) {
      return res.status(400).json({ success: false, error: 'Name, rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    const testimonial = await Testimonial.create({
      name,
      email: surveyLink.clientEmail,
      content,
      rating: Number(rating),
      location: location || undefined,
      status: 'pending',
      surveyLink: surveyLink._id,
      quote: surveyLink.quote
    });

    surveyLink.status = 'completed';
    surveyLink.completedAt = new Date();
    surveyLink.testimonialId = testimonial._id;
    await surveyLink.save();

    res.status(201).json({
      success: true,
      data: { message: 'Thank you for your feedback!' }
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Generate a direct survey link without a quote (WhatsApp / in-person clients)
// @route   POST /api/surveys/generate-direct
// @access  Protected
exports.generateDirectLink = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ success: false, error: 'Client name is required' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const surveyLink = await SurveyLink.create({
      token,
      clientName: clientName.trim(),
      clientEmail: clientEmail?.trim() || undefined,
      clientPhone: clientPhone?.trim() || undefined,
      expiresAt,
      source: 'direct',
      sentAt: new Date()
    });

    const surveyUrl = `${process.env.FRONTEND_URL}/survey/${token}`;

    res.status(201).json({
      success: true,
      data: {
        ...surveyLink.toObject(),
        surveyUrl
      }
    });
  } catch (error) {
    console.error('Error generating direct survey link:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get all survey links for a quote
// @route   GET /api/surveys/quote/:quoteId
// @access  Protected
exports.getSurveyLinksByQuote = async (req, res) => {
  try {
    const links = await SurveyLink.find({ quote: req.params.quoteId })
      .populate('testimonialId', 'name rating status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    console.error('Error fetching survey links:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
