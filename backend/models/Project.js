const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor ingrese un título'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Por favor ingrese una descripción']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'La descripción corta no puede tener más de 200 caracteres']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Por favor seleccione una categoría']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String,
    isFeatured: {
      type: Boolean,
      default: false
    }
  }],
  location: {
    type: String
  },
  client: {
    type: String
  },
  completionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'completed'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create slug from title
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true }) + '-' + Date.now().toString(36);
  }
  next();
});

// Index for search
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);
