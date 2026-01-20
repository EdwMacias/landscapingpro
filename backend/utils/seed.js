const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Models
const User = require('../models/User');
const Category = require('../models/Category');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Project.deleteMany();
    await Testimonial.deleteMany();
    await Gallery.deleteMany();

    console.log('Data cleared...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Administrador',
      email: 'admin@ddlandscaping.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create worker user
    await User.create({
      name: 'Juan Trabajador',
      email: 'worker@ddlandscaping.com',
      password: 'worker123',
      role: 'worker'
    });

    console.log('Users created...');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Diseño de Jardines',
        description: 'Diseño y planificación de jardines residenciales y comerciales',
        icon: 'flower'
      },
      {
        name: 'Mantenimiento',
        description: 'Servicios de mantenimiento regular de áreas verdes',
        icon: 'scissors'
      },
      {
        name: 'Paisajismo',
        description: 'Proyectos completos de paisajismo y transformación',
        icon: 'tree'
      },
      {
        name: 'Sistemas de Riego',
        description: 'Instalación y mantenimiento de sistemas de irrigación',
        icon: 'droplet'
      },
      {
        name: 'Hardscaping',
        description: 'Construcción de patios, caminos y muros decorativos',
        icon: 'brick'
      },
      {
        name: 'Árboles y Podas',
        description: 'Servicios de poda, plantación y cuidado de árboles',
        icon: 'tree-pine'
      }
    ]);

    console.log('Categories created...');

    // Create sample projects
    const projects = await Project.create([
      {
        title: 'Jardín Residencial Moderno',
        description: 'Transformación completa de un patio trasero de 500m² en un oasis moderno con áreas de descanso, jardín de piedras zen y plantas nativas. El proyecto incluyó la instalación de un sistema de riego automatizado y iluminación LED paisajística.',
        shortDescription: 'Transformación de patio trasero en jardín moderno con áreas zen',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', isFeatured: true },
          { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800' }
        ],
        location: 'Miami, FL',
        status: 'completed',
        featured: true,
        tags: ['moderno', 'zen', 'residencial'],
        createdBy: adminUser._id
      },
      {
        title: 'Patio Comercial con Terraza',
        description: 'Diseño e implementación de un espacio verde para un complejo de oficinas. Incluye terraza con pérgola, jardineras elevadas y un pequeño estanque decorativo.',
        shortDescription: 'Espacio verde comercial con terraza y pérgola',
        category: categories[2]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isFeatured: true }
        ],
        location: 'Fort Lauderdale, FL',
        status: 'completed',
        featured: true,
        tags: ['comercial', 'terraza', 'pérgola'],
        createdBy: adminUser._id
      },
      {
        title: 'Sistema de Riego Inteligente',
        description: 'Instalación de sistema de riego por goteo con sensores de humedad y control mediante app móvil. Cobertura de 1200m² de jardín con más de 50 zonas independientes.',
        shortDescription: 'Sistema de riego automatizado con control por app',
        category: categories[3]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', isFeatured: true }
        ],
        location: 'Coral Gables, FL',
        status: 'completed',
        featured: false,
        tags: ['riego', 'tecnología', 'sostenible'],
        createdBy: adminUser._id
      },
      {
        title: 'Patio de Piedra Natural',
        description: 'Construcción de patio con adoquines de piedra natural, muros de contención decorativos y escaleras integradas. El proyecto transformó un terreno irregular en un espacio funcional y elegante.',
        shortDescription: 'Patio de piedra natural con muros decorativos',
        category: categories[4]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isFeatured: true }
        ],
        location: 'Boca Raton, FL',
        status: 'completed',
        featured: true,
        tags: ['hardscape', 'piedra', 'elegante'],
        createdBy: adminUser._id
      },
      {
        title: 'Mantenimiento Mensual Comunidad',
        description: 'Servicio de mantenimiento integral para comunidad residencial. Incluye corte de césped, poda de setos, fertilización y control de plagas.',
        shortDescription: 'Mantenimiento integral de áreas comunes',
        category: categories[1]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800', isFeatured: true }
        ],
        location: 'Pompano Beach, FL',
        status: 'in_progress',
        featured: false,
        tags: ['mantenimiento', 'comunidad', 'mensual'],
        createdBy: adminUser._id
      }
    ]);

    console.log('Projects created...');

    // Create testimonials
    await Testimonial.create([
      {
        name: 'María García',
        email: 'maria@email.com',
        content: 'Excelente trabajo en nuestro jardín. El equipo fue muy profesional y el resultado superó nuestras expectativas. Totalmente recomendados.',
        rating: 5,
        project: projects[0]._id,
        location: 'Miami, FL',
        status: 'approved',
        featured: true
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@email.com',
        content: 'Contratamos a D&D para el mantenimiento de nuestra comunidad y estamos muy satisfechos. Puntuales, profesionales y con precios justos.',
        rating: 5,
        location: 'Pompano Beach, FL',
        status: 'approved',
        featured: true
      },
      {
        name: 'Ana Martínez',
        email: 'ana@email.com',
        content: 'El sistema de riego que instalaron funciona perfectamente. Ahora ahorramos agua y nuestras plantas están más saludables que nunca.',
        rating: 4,
        project: projects[2]._id,
        location: 'Coral Gables, FL',
        status: 'approved',
        featured: false
      },
      {
        name: 'Roberto López',
        email: 'roberto@email.com',
        content: 'Transformaron nuestro patio en un espacio increíble. El trabajo con la piedra natural quedó espectacular.',
        rating: 5,
        project: projects[3]._id,
        location: 'Boca Raton, FL',
        status: 'approved',
        featured: true
      }
    ]);

    console.log('Testimonials created...');

    // Create gallery items
    await Gallery.create([
      {
        title: 'Jardín Tropical',
        description: 'Diseño de jardín con plantas tropicales',
        image: { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
        category: categories[0]._id,
        project: projects[0]._id,
        featured: true,
        order: 1
      },
      {
        title: 'Patio de Piedra',
        description: 'Instalación de adoquines naturales',
        image: { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800' },
        category: categories[4]._id,
        project: projects[3]._id,
        featured: true,
        order: 2
      },
      {
        title: 'Terraza Comercial',
        description: 'Espacio verde para oficinas',
        image: { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
        category: categories[2]._id,
        project: projects[1]._id,
        featured: true,
        order: 3
      },
      {
        title: 'Sistema de Riego',
        description: 'Instalación de riego automatizado',
        image: { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800' },
        category: categories[3]._id,
        project: projects[2]._id,
        featured: false,
        order: 4
      }
    ]);

    console.log('Gallery created...');

    console.log('\n========================================');
    console.log('Seed completed successfully!');
    console.log('========================================');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@ddlandscaping.com');
    console.log('Password: admin123');
    console.log('\nWorker credentials:');
    console.log('Email: worker@ddlandscaping.com');
    console.log('Password: worker123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
