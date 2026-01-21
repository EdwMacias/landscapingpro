<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/utils/api'
import { ArrowRightIcon, CheckCircleIcon, StarIcon } from '@heroicons/vue/24/solid'

const featuredProjects = ref([])
const testimonials = ref([])
const loading = ref(true)

const services = [
  {
    title: 'Diseño de Jardines',
    description: 'Creamos espacios verdes únicos que reflejan tu estilo y complementan tu hogar.',
    icon: '🌸'
  },
  {
    title: 'Paisajismo',
    description: 'Transformamos terrenos en paisajes impresionantes con diseños profesionales.',
    icon: '🌳'
  },
  {
    title: 'Mantenimiento',
    description: 'Servicio regular para mantener tu jardín en perfectas condiciones todo el año.',
    icon: '✂️'
  },
  {
    title: 'Sistemas de Riego',
    description: 'Instalación de sistemas de irrigación eficientes y automatizados.',
    icon: '💧'
  },
  {
    title: 'Hardscaping',
    description: 'Construcción de patios, caminos y estructuras decorativas en piedra.',
    icon: '🧱'
  },
  {
    title: 'Poda de Árboles',
    description: 'Cuidado profesional y mantenimiento de árboles y arbustos.',
    icon: '🌲'
  }
]

const features = [
  'Más de 10 años de experiencia',
  'Equipo profesional certificado',
  'Materiales de primera calidad',
  'Garantía en todos nuestros trabajos',
  'Presupuestos sin compromiso',
  'Atención personalizada'
]

onMounted(async () => {
  try {
    const [projectsRes, testimonialsRes] = await Promise.all([
      api.get('/projects', { params: { featured: true, limit: 3 } }),
      api.get('/testimonials', { params: { featured: true, limit: 3 } })
    ])
    featuredProjects.value = projectsRes.data?.data || []
    testimonials.value = testimonialsRes.data?.data || []
  } catch (error) {
    console.error('Error loading data:', error)
    featuredProjects.value = []
    testimonials.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920')] bg-cover bg-center"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-fade-in">
            Transformamos tu espacio exterior en un
            <span class="text-accent-400">paraíso verde</span>
          </h1>
          <p class="mt-6 text-lg md:text-xl text-primary-100 animate-fade-in" style="animation-delay: 0.2s">
            Servicios profesionales de paisajismo y jardinería en el sur de Florida.
            Diseñamos, construimos y mantenemos espacios exteriores excepcionales.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style="animation-delay: 0.4s">
            <RouterLink to="/cotizacion" class="btn-accent text-lg px-8">
              Solicitar Cotización Gratis
            </RouterLink>
            <RouterLink to="/proyectos" class="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-800">
              Ver Proyectos
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>

    <!-- Services Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="section-subtitle mx-auto">
            Ofrecemos una gama completa de servicios de paisajismo para transformar cualquier espacio exterior.
          </p>
        </div>
        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(service, index) in services"
            :key="service.title"
            class="group p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all duration-300"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="text-4xl mb-4">{{ service.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary-700">
              {{ service.title }}
            </h3>
            <p class="mt-2 text-gray-600">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="section-title">Proyectos Destacados</h2>
            <p class="section-subtitle">Algunos de nuestros trabajos más recientes</p>
          </div>
          <RouterLink to="/proyectos" class="hidden md:flex items-center text-primary-600 font-semibold hover:text-primary-700">
            Ver todos
            <ArrowRightIcon class="ml-2 h-5 w-5" />
          </RouterLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="n in 3" :key="n" class="card animate-pulse">
            <div class="h-64 bg-gray-200"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RouterLink
            v-for="project in featuredProjects"
            :key="project._id"
            :to="`/proyectos/${project.slug}`"
            class="card group hover:shadow-xl transition-shadow duration-300"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                :src="project.images[0]?.url || 'https://via.placeholder.com/400x300'"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span class="absolute bottom-4 left-4 bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                {{ project.category?.name }}
              </span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-gray-600 line-clamp-2">
                {{ project.shortDescription || project.description }}
              </p>
            </div>
          </RouterLink>
        </div>

        <div class="mt-8 text-center md:hidden">
          <RouterLink to="/proyectos" class="btn-primary">
            Ver todos los proyectos
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title">¿Por qué elegirnos?</h2>
            <p class="section-subtitle">
              En D&D Landscaping Pro nos comprometemos con la excelencia en cada proyecto que emprendemos.
            </p>
            <ul class="mt-8 space-y-4">
              <li v-for="feature in features" :key="feature" class="flex items-start">
                <CheckCircleIcon class="h-6 w-6 text-primary-600 flex-shrink-0" />
                <span class="ml-3 text-gray-700">{{ feature }}</span>
              </li>
            </ul>
            <RouterLink to="/nosotros" class="btn-primary mt-8 inline-flex">
              Conoce más sobre nosotros
            </RouterLink>
          </div>
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
              alt="Equipo de trabajo"
              class="rounded-xl shadow-2xl"
              loading="lazy"
            />
            <div class="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-xl shadow-lg">
              <div class="text-4xl font-bold">10+</div>
              <div class="text-primary-100">Años de experiencia</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="section-title text-white">Lo que dicen nuestros clientes</h2>
          <p class="section-subtitle text-primary-200 mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación.
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial._id"
            class="bg-primary-800/50 p-6 rounded-xl backdrop-blur"
          >
            <div class="flex mb-4">
              <StarIcon
                v-for="n in testimonial.rating"
                :key="n"
                class="h-5 w-5 text-accent-400"
              />
            </div>
            <p class="text-primary-100 italic">"{{ testimonial.content }}"</p>
            <div class="mt-4 flex items-center">
              <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">{{ testimonial.name[0] }}</span>
              </div>
              <div class="ml-3">
                <div class="font-semibold">{{ testimonial.name }}</div>
                <div class="text-sm text-primary-300">{{ testimonial.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-accent-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white">
          ¿Listo para transformar tu espacio?
        </h2>
        <p class="mt-4 text-lg text-accent-100 max-w-2xl mx-auto">
          Contáctanos hoy para una consulta gratuita y descubre cómo podemos hacer realidad el jardín de tus sueños.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink to="/cotizacion" class="btn bg-white text-accent-700 hover:bg-gray-100">
            Solicitar Cotización
          </RouterLink>
          <RouterLink to="/contacto" class="btn border-2 border-white text-white hover:bg-white hover:text-accent-700">
            Contactar
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
