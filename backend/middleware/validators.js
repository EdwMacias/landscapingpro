const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validators
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Contact validators
exports.contactValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('message').trim().notEmpty().withMessage('El mensaje es requerido')
    .isLength({ max: 1000 }).withMessage('El mensaje no puede exceder 1000 caracteres')
];

// Quote validators
exports.quoteValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('phone').trim().notEmpty().withMessage('El teléfono es requerido'),
  body('serviceType').notEmpty().withMessage('El tipo de servicio es requerido'),
  body('description').trim().notEmpty().withMessage('La descripción del proyecto es requerida')
    .isLength({ max: 2000 }).withMessage('La descripción no puede exceder 2000 caracteres')
];

// Project validators
exports.projectValidation = [
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('description').trim().notEmpty().withMessage('La descripción es requerida'),
  body('category').notEmpty().withMessage('La categoría es requerida')
];

// Testimonial validators
exports.testimonialValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('content').trim().notEmpty().withMessage('El comentario es requerido')
    .isLength({ max: 500 }).withMessage('El comentario no puede exceder 500 caracteres'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5')
];
