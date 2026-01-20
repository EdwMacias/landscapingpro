<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/utils/api'
import { useCategoriesStore } from '@/stores/categories'
import { PlusIcon, PencilIcon, TrashIcon, StarIcon, XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'

const categoriesStore = useCategoriesStore()

const images = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEdit = ref(false)
const currentImage = ref(null)
const saving = ref(false)

const form = reactive({
  title: '',
  description: '',
  category: '',
  featured: false
})

const imageFile = ref(null)
const imagePreview = ref('')

async function fetchGallery() {
  loading.value = true
  try {
    const response = await api.get('/gallery')
    images.value = response.data.data
  } catch (error) {
    console.error('Error:', error)
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

function openCreate() {
  isEdit.value = false
  currentImage.value = null
  Object.assign(form, { title: '', description: '', category: '', featured: false })
  imageFile.value = null
  imagePreview.value = ''
  showModal.value = true
}

function openEdit(image) {
  isEdit.value = true
  currentImage.value = image
  Object.assign(form, {
    title: image.title,
    description: image.description || '',
    category: image.category?._id || '',
    featured: image.featured
  })
  imagePreview.value = image.image.url
  showModal.value = true
}

function handleImageChange(e) {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  saving.value = true

  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('category', form.category)
    formData.append('featured', form.featured)

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    if (isEdit.value) {
      await api.put(`/gallery/${currentImage.value._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    await fetchGallery()
    showModal.value = false
  } catch (error) {
    console.error('Error:', error)
  } finally {
    saving.value = false
  }
}

async function toggleFeatured(image) {
  try {
    await api.put(`/gallery/${image._id}`, { featured: !image.featured })
    await fetchGallery()
  } catch (error) {
    console.error('Error:', error)
  }
}

async function deleteImage(id) {
  if (confirm('¿Eliminar esta imagen de la galería?')) {
    try {
      await api.delete(`/gallery/${id}`)
      await fetchGallery()
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Galería</h1>
        <p class="text-gray-600">Gestiona las imágenes de la galería principal</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nueva Imagen
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
    </div>

    <div v-else-if="images.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
      <PhotoIcon class="h-12 w-12 mx-auto text-gray-400" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900">No hay imágenes</h3>
      <p class="text-gray-500">Comienza agregando imágenes a la galería</p>
      <button @click="openCreate" class="btn-primary mt-4">
        <PlusIcon class="h-5 w-5 mr-2" />
        Agregar Imagen
      </button>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="image in images"
        :key="image._id"
        class="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
      >
        <img :src="image.image.url" :alt="image.title" class="w-full h-full object-cover" />

        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
          <div class="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <p class="font-medium truncate">{{ image.title }}</p>
            <p v-if="image.category" class="text-sm text-gray-200">{{ image.category.name }}</p>
          </div>

          <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="toggleFeatured(image)"
              :class="[
                'p-1.5 rounded-lg',
                image.featured ? 'bg-accent-500 text-white' : 'bg-white text-gray-700'
              ]"
              title="Destacar"
            >
              <StarSolidIcon v-if="image.featured" class="h-4 w-4" />
              <StarIcon v-else class="h-4 w-4" />
            </button>
            <button
              @click="openEdit(image)"
              class="p-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100"
              title="Editar"
            >
              <PencilIcon class="h-4 w-4" />
            </button>
            <button
              @click="deleteImage(image._id)"
              class="p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50"
              title="Eliminar"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div v-if="image.featured" class="absolute top-2 left-2">
          <StarSolidIcon class="h-5 w-5 text-accent-500" />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div class="p-6 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEdit ? 'Editar Imagen' : 'Nueva Imagen' }}
            </h3>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <!-- Image preview/upload -->
            <div>
              <label class="label">Imagen {{ isEdit ? '' : '*' }}</label>
              <div v-if="imagePreview" class="relative">
                <img :src="imagePreview" class="w-full h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="imagePreview = ''; imageFile = null"
                  class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
              <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <PhotoIcon class="h-8 w-8 mx-auto text-gray-400" />
                <label class="btn-secondary mt-2 cursor-pointer inline-flex text-sm">
                  Seleccionar imagen
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="hidden"
                    :required="!isEdit"
                  />
                </label>
              </div>
            </div>

            <div>
              <label class="label">Título *</label>
              <input v-model="form.title" type="text" required class="input" />
            </div>

            <div>
              <label class="label">Descripción</label>
              <textarea v-model="form.description" rows="2" class="input"></textarea>
            </div>

            <div>
              <label class="label">Categoría</label>
              <select v-model="form.category" class="input">
                <option value="">Sin categoría</option>
                <option v-for="cat in categoriesStore.categories" :key="cat._id" :value="cat._id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <label class="flex items-center">
              <input v-model="form.featured" type="checkbox" class="rounded border-gray-300 text-primary-600 mr-2" />
              Imagen destacada
            </label>

            <div class="flex justify-end gap-4 pt-4">
              <button type="button" @click="showModal = false" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="saving" class="btn-primary">
                {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Agregar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
