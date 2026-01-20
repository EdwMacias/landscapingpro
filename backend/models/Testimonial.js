const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese el nombre'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  content: {
    type: String,
    required: [true, 'Por favor ingrese el comentario'],
    maxlength: [500, 'El comentario no puede tener más de 500 caracteres']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  avatar: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
