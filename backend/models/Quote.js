const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese su nombre'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese su email'],
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  phone: {
    type: String,
    required: [true, 'Por favor ingrese su teléfono']
  },
  address: {
    type: String
  },
  serviceType: {
    type: String,
    required: [true, 'Por favor seleccione el tipo de servicio'],
    enum: [
      'landscaping',
      'garden_design',
      'lawn_care',
      'irrigation',
      'hardscaping',
      'tree_service',
      'maintenance',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Por favor describa su proyecto'],
    maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres']
  },
  budget: {
    type: String,
    enum: ['under_1000', '1000_5000', '5000_10000', '10000_25000', 'over_25000', 'not_sure']
  },
  timeline: {
    type: String,
    enum: ['asap', '1_month', '3_months', '6_months', 'flexible']
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  status: {
    type: String,
    enum: ['new', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'new'
  },
  quotedAmount: {
    type: Number
  },
  notes: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quote', quoteSchema);
