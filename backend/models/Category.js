const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese el nombre de la categoría'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [200, 'La descripción no puede tener más de 200 caracteres']
  },
  icon: {
    type: String,
    default: 'leaf'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
