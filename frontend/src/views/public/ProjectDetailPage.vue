<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { formatDate } from '@/utils/helpers'
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, TagIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const projectsStore = useProjectsStore()

const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

onMounted(async () => {
  await projectsStore.fetchProject(route.params.slug)
})

function openLightbox(index) {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function nextImage() {
  if (currentImageIndex.value < projectsStore.currentProject.images.length - 1) {
    currentImageIndex.value++
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}
</script>

<template>
  <div>
    <div v-if="projectsStore.loading" class="py-20">
      <div class="max-w-4xl mx-auto px-4 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-12 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div class="h-96 bg-gray-200 rounded mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <div v-else-if="projectsStore.currentProject">
      <!-- Hero -->
      <section class="bg-primary-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RouterLink to="/proyectos" class="inline-flex items-center text-primary-200 hover:text-white mb-4">
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Volver a proyectos
          </RouterLink>
          <h1 class="text-4xl md:text-5xl font-display font-bold">
            {{ projectsStore.currentProject.title }}
          </h1>
          <div class="mt-4 flex flex-wrap gap-4 text-primary-200">
            <span v-if="projectsStore.currentProject.location" class="flex items-center">
              <MapPinIcon class="h-5 w-5 mr-1" />
              {{ projectsStore.currentProject.location }}
            </span>
            <span v-if="projectsStore.currentProject.completionDate" class="flex items-center">
              <CalendarIcon class="h-5 w-5 mr-1" />
              {{ formatDate(projectsStore.currentProject.completionDate) }}
            </span>
            <span class="flex items-center">
              <TagIcon class="h-5 w-5 mr-1" />
              {{ projectsStore.currentProject.category?.name }}
            </span>
          </div>
        </div>
      </section>

      <!-- Gallery -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Main Image -->
          <div
            class="relative h-96 md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
            @click="openLightbox(0)"
          >
            <img
              :src="projectsStore.currentProject.images[0]?.url"
              :alt="projectsStore.currentProject.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <!-- Thumbnails -->
          <div
            v-if="projectsStore.currentProject.images.length > 1"
            class="mt-4 grid grid-cols-4 md:grid-cols-6 gap-4"
          >
            <div
              v-for="(image, index) in projectsStore.currentProject.images"
              :key="index"
              class="relative h-24 rounded-lg overflow-hidden cursor-pointer"
              @click="openLightbox(index)"
            >
              <img
                :src="image.url"
                :alt="`${projectsStore.currentProject.title} - ${index + 1}`"
                class="w-full h-full object-cover hover:opacity-80 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Description -->
      <section class="py-12 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Descripción del Proyecto</h2>
          <div class="prose prose-lg max-w-none text-gray-600">
            <p>{{ projectsStore.currentProject.description }}</p>
          </div>

          <!-- Tags -->
          <div v-if="projectsStore.currentProject.tags?.length" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Etiquetas</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in projectsStore.currentProject.tags"
                :key="tag"
                class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-12 bg-primary-600 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-2xl font-bold">¿Te gustaría un proyecto similar?</h2>
          <p class="mt-2 text-primary-100">Contáctanos para una cotización gratuita</p>
          <RouterLink to="/cotizacion" class="btn bg-white text-primary-700 hover:bg-gray-100 mt-6">
            Solicitar Cotización
          </RouterLink>
        </div>
      </section>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <XMarkIcon class="h-8 w-8" />
        </button>

        <button
          v-if="currentImageIndex > 0"
          @click="prevImage"
          class="absolute left-4 text-white hover:text-gray-300 text-4xl"
        >
          &#8249;
        </button>

        <img
          :src="projectsStore.currentProject.images[currentImageIndex]?.url"
          :alt="projectsStore.currentProject.title"
          class="max-h-[90vh] max-w-[90vw] object-contain"
        />

        <button
          v-if="currentImageIndex < projectsStore.currentProject.images.length - 1"
          @click="nextImage"
          class="absolute right-4 text-white hover:text-gray-300 text-4xl"
        >
          &#8250;
        </button>

        <div class="absolute bottom-4 text-white">
          {{ currentImageIndex + 1 }} / {{ projectsStore.currentProject.images.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
