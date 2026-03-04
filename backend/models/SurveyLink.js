const mongoose = require('mongoose');

const surveyLinkSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote'
  },
  clientName: {
    type: String
  },
  clientEmail: {
    type: String
  },
  clientPhone: {
    type: String
  },
  source: {
    type: String,
    enum: ['quote', 'direct'],
    default: 'quote'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  testimonialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Testimonial'
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SurveyLink', surveyLinkSchema);
