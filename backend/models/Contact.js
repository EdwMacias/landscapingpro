const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
    type: String
  },
  message: {
    type: String,
    required: [true, 'Por favor ingrese un mensaje'],
    maxlength: [1000, 'El mensaje no puede tener más de 1000 caracteres']
  },
  attachments: [{
    url: String,
    publicId: String,
    filename: String
  }],
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
