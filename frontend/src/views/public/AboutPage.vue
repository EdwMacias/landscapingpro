<script setup>
import { RouterLink } from 'vue-router'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const services = [
  { icon: '✂️', title: 'General Landscape Maintenance' },
  { icon: '💧', title: 'Irrigation System Services' },
  { icon: '🌿', title: 'Trimming and Shrub Care' },
  { icon: '🌱', title: 'Weed Control (Planting Beds)' },
  { icon: '🌾', title: 'Lawn Weed Control' },
  { icon: '🌲', title: 'Tree Pruning and Maintenance' },
  { icon: '🧪', title: 'Fertilization Programs' },
  { icon: '🏡', title: 'Landscape Installations' },
  { icon: '🌸', title: 'Garden and Landscape Design' }
]

const values = [
  {
    title: 'Quality',
    description: 'We use professional standards and proper techniques on every project.'
  },
  {
    title: 'Reliability',
    description: 'Consistent processes and attention to detail you can count on, every time.'
  },
  {
    title: 'Integrity',
    description: 'Transparent communication and honest service on every job we take.'
  },
  {
    title: 'Results',
    description: 'Healthy, well-maintained outdoor spaces that protect long-term property value.'
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
        <h1 class="text-4xl md:text-5xl font-display font-bold">About Us</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">
          Learn about the company, mission, and team behind D&D Landscaping Pro LLC
        </p>
      </div>
    </section>

    <!-- About / Story -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title">Who We Are</h2>
            <div class="mt-6 space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                D&D Landscaping Pro LLC is a professional landscaping company focused on reliable
                landscape maintenance and outdoor care for residential and commercial properties.
              </p>
              <p>
                We work with technical standards, consistent processes, and attention to detail to
                deliver clean, healthy, and well-maintained outdoor spaces our clients can trust.
              </p>
            </div>
          </div>
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
              alt="Our work"
              class="rounded-xl shadow-xl"
            />
            <div class="absolute -bottom-6 -right-6 bg-accent-500 text-white p-6 rounded-xl shadow-lg hidden md:block">
              <div class="text-4xl font-bold">20+</div>
              <div>Projects completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title">Our Services</h2>
          <p class="section-subtitle mx-auto">
            Comprehensive landscaping solutions for residential and commercial properties.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in services"
            :key="service.title"
            class="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <span class="text-3xl flex-shrink-0">{{ service.icon }}</span>
            <p class="text-gray-800 font-medium leading-snug">{{ service.title }}</p>
          </div>
        </div>
        <p class="mt-10 text-center text-gray-500 max-w-2xl mx-auto">
          Our services are performed using professional standards, proper techniques, and reliable
          processes to ensure consistent results, landscape health, and long-term property value.
        </p>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="section-title">Our Values</h2>
          <p class="section-subtitle mx-auto">
            The principles that guide every decision and every project we take on.
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

    <!-- Team / Founder -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title">Our Leadership</h2>
          <p class="section-subtitle mx-auto">
            The person driving our commitment to excellence every day.
          </p>
        </div>
        <div class="flex justify-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
            <img
              src="/founder.jpeg"
              alt="Diego Peñaranda"
              class="w-36 h-36 rounded-full mx-auto object-cover shadow-lg border-4 border-primary-100"
            />
            <h3 class="mt-6 text-2xl font-semibold text-gray-900">Diego Peñaranda</h3>
            <p class="text-primary-600 font-medium mt-1">Founder & CEO</p>
            <p class="mt-4 text-gray-600 leading-relaxed">
              Leading D&D Landscaping Pro LLC with a focus on professionalism, reliability,
              and delivering outdoor spaces that clients can truly be proud of.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">5+</div>
            <div class="mt-2 text-primary-200">Years of experience</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">20+</div>
            <div class="mt-2 text-primary-200">Projects completed</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">98%</div>
            <div class="mt-2 text-primary-200">Satisfied clients</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold text-accent-400">9</div>
            <div class="mt-2 text-primary-200">Services offered</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-accent-500">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-display font-bold text-white">
          Ready to work with us?
        </h2>
        <p class="mt-4 text-accent-100">
          Contact us today and discover how we can transform your outdoor space.
        </p>
        <RouterLink to="/cotizacion" class="btn bg-white text-accent-700 hover:bg-gray-100 mt-6">
          Get a Free Quote
        </RouterLink>
      </div>
    </section>
  </div>
</template>
