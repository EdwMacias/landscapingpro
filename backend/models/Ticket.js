const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Por favor ingrese su nombre'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  address: {
    type: String,
    required: [true, 'Por favor ingrese su dirección'],
    trim: true,
    maxlength: [200, 'La dirección no puede tener más de 200 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese su email'],
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  phone: {
    type: String,
    required: [true, 'Por favor ingrese su teléfono'],
    trim: true
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [150, 'El asunto no puede tener más de 150 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor describa el problema'],
    maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres']
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  source: {
    type: String,
    enum: ['public', 'direct'],
    default: 'public'
  },
  dataConsent: {
    type: Boolean,
    required: [true, 'Debe aceptar el uso de sus datos para continuar'],
    validate: {
      validator: (v) => v === true,
      message: 'Debe aceptar el uso de sus datos para continuar'
    }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
