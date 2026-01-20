<script setup>
import { RouterLink } from 'vue-router'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const team = [
  {
    name: 'David Martinez',
    role: 'Fundador & Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Con más de 15 años en el sector del paisajismo, David lidera cada proyecto con pasión y dedicación.'
  },
  {
    name: 'Diana Rodríguez',
    role: 'Diseñadora de Paisajes',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Especialista en diseño sostenible y jardines nativos de Florida.'
  },
  {
    name: 'Carlos Hernández',
    role: 'Jefe de Operaciones',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Supervisa todos los proyectos garantizando la más alta calidad en cada detalle.'
  }
]

const values = [
  {
    title: 'Calidad',
    description: 'Utilizamos solo los mejores materiales y técnicas en cada proyecto.'
  },
  {
    title: 'Compromiso',
    description: 'Nos comprometemos con cada cliente hasta lograr su satisfacción total.'
  },
  {
    title: 'Sostenibilidad',
    description: 'Promovemos prácticas ecológicas y el uso de plantas nativas.'
  },
  {
    title: 'Innovación',
    description: 'Constantemente actualizamos nuestras técnicas y diseños.'
  }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative bg-primary-900 text-white py-20">
      <div class="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920"
          alt="Background"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-display font-bold">Sobre Nosotros</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">
          Conoce la historia, misión y el equipo detrás de D&D Landscaping Pro
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title">Nuestra Historia</h2>
            <div class="mt-6 space-y-4 text-gray-600">
              <p>
                D&D Landscaping Pro nació en 2014 con una visión clara: transformar espacios exteriores
                en verdaderas obras de arte naturales que mejoren la calidad de vida de nuestros clientes.
              </p>
              <p>
                Lo que comenzó como un pequeño negocio familiar en Miami se ha convertido en una de las
                empresas de paisajismo más respetadas del sur de Florida, sirviendo a cientos de clientes
                residenciales y comerciales.
              </p>
              <p>
                Nuestro nombre, D&D, representa los nombres de nuestros fundadores, David y Diana,
                quienes siguen involucrados en cada proyecto, asegurando que cada espacio que creamos
                refleje nuestra pasión por la naturaleza y el diseño.
              </p>
            </div>
          </div>
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
              alt="Nuestro trabajo"
              class="rounded-xl shadow-xl"
            />
            <div class="absolute -bottom-6 -right-6 bg-accent-500 text-white p-6 rounded-xl shadow-lg hidden md:block">
              <div class="text-4xl font-bold">500+</div>
              <div>Proyectos completados</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="section-title">Nuestros Valores</h2>
          <p class="section-subtitle mx-auto">
            Los principios que guían cada decisión y cada proyecto que emprendemos.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in values" :key="value.title" class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon class="h-8 w-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">{{ value.title }}</h3>
            <p class="mt-2 text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="section-title">Nuestro Equipo</h2>
          <p class="section-subtitle mx-auto">
            Profesionales apasionados que hacen posible cada transformación.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="member in team" :key="member.name" class="text-center">
            <img
              :src="member.image"
              :alt="member.name"
              class="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
            />
            <h3 class="mt-4 text-xl font-semibold text-gray-900">{{ member.name }}</h3>
            <p class="text-primary-600 font-medium">{{ member.role }}</p>
            <p class="mt-2 text-gray-600">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">10+</div>
            <div class="mt-2 text-primary-200">Años de experiencia</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">500+</div>
            <div class="mt-2 text-primary-200">Proyectos completados</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">98%</div>
            <div class="mt-2 text-primary-200">Clientes satisfechos</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">25+</div>
            <div class="mt-2 text-primary-200">Profesionales</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-accent-500">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-display font-bold text-white">
          ¿Listo para trabajar con nosotros?
        </h2>
        <p class="mt-4 text-accent-100">
          Contáctanos hoy y descubre cómo podemos transformar tu espacio exterior.
        </p>
        <RouterLink to="/cotizacion" class="btn bg-white text-accent-700 hover:bg-gray-100 mt-6">
          Solicitar Cotización Gratis
        </RouterLink>
      </div>
    </section>
  </div>
</template>
