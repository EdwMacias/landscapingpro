<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/utils/api'
import { useCategoriesStore } from '@/stores/categories'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const categoriesStore = useCategoriesStore()

const images = ref([])
const loading = ref(true)
const selectedCategory = ref('')
const lightboxOpen = ref(false)
const currentImage = ref(null)

async function fetchGallery() {
  loading.value = true
  try {
    const params = {}
    if (selectedCategory.value) params.category = selectedCategory.value
    const response = await api.get('/gallery', { params })
    images.value = response.data.data
  } catch (error) {
    console.error('Error fetching gallery:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchGallery(),
    categoriesStore.fetchCategories()
  ])
})

watch(selectedCategory, fetchGallery)

function openLightbox(image) {
  currentImage.value = image
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  currentImage.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-5xl font-display font-bold">Galería</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          Explora nuestra colección de imágenes y descubre la belleza de nuestros trabajos de paisajismo.
        </p>
      </div>
    </section>

    <!-- Filter -->
    <section class="bg-white border-b sticky top-20 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = ''"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              !selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Todas
          </button>
          <button
            v-for="cat in categoriesStore.categories"
            :key="cat._id"
            @click="selectedCategory = cat._id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === cat._id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="n in 12" :key="n" class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div v-else-if="images.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No hay imágenes en esta categoría.</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="image in images"
            :key="image._id"
            class="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            @click="openLightbox(image)"
          >
            <img
              :src="image.image.url"
              :alt="image.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
              <div class="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 class="font-semibold">{{ image.title }}</h3>
                <p v-if="image.category" class="text-sm text-gray-200">{{ image.category.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen && currentImage"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        @click.self="closeLightbox"
      >
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <XMarkIcon class="h-8 w-8" />
        </button>

        <div class="max-w-5xl w-full">
          <img
            :src="currentImage.image.url"
            :alt="currentImage.title"
            class="max-h-[80vh] w-full object-contain"
          />
          <div class="mt-4 text-white text-center">
            <h3 class="text-xl font-semibold">{{ currentImage.title }}</h3>
            <p v-if="currentImage.description" class="text-gray-300 mt-1">{{ currentImage.description }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
