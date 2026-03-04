const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateSurveyLink,
  generateDirectLink,
  validateSurveyToken,
  submitSurvey,
  getSurveyLinksByQuote
} = require('../controllers/surveyController');

// Protected routes (admin)
router.post('/generate-direct', protect, generateDirectLink);
router.get('/quote/:quoteId', protect, getSurveyLinksByQuote);
router.post('/generate/:quoteId', protect, generateSurveyLink);

// Public routes
router.get('/:token', validateSurveyToken);
router.post('/:token', submitSurvey);

module.exports = router;
