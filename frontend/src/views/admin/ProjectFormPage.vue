<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useCategoriesStore } from '@/stores/categories'
import api from '@/utils/api'
import { XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const categoriesStore = useCategoriesStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  description: '',
  shortDescription: '',
  category: '',
  location: '',
  status: 'completed',
  featured: false,
  isPublished: true,
  tags: ''
})

const existingImages = ref([])
const newImages = ref([])
const imagePreviews = ref([])

onMounted(async () => {
  await categoriesStore.fetchCategories()

  if (isEdit.value) {
    loading.value = true
    try {
      const response = await api.get(`/projects/admin/all`)
      const project = response.data.data.find(p => p._id === route.params.id)

      if (project) {
        form.title = project.title
        form.description = project.description
        form.shortDescription = project.shortDescription || ''
        form.category = project.category?._id || ''
        form.location = project.location || ''
        form.status = project.status
        form.featured = project.featured
        form.isPublished = project.isPublished
        form.tags = project.tags?.join(', ') || ''
        existingImages.value = project.images || []
      }
    } catch (err) {
      error.value = 'Error al cargar el proyecto'
    } finally {
      loading.value = false
    }
  }
})

function handleImageChange(e) {
  const files = Array.from(e.target.files)
  newImages.value = [...newImages.value, ...files]

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeNewImage(index) {
  newImages.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

async function removeExistingImage(imageId) {
  if (isEdit.value) {
    const result = await projectsStore.deleteProjectImage(route.params.id, imageId)
    if (result.success) {
      existingImages.value = existingImages.value.filter(img => img._id !== imageId)
    }
  }
}

async function handleSubmit() {
  saving.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('shortDescription', form.shortDescription)
    formData.append('category', form.category)
    formData.append('location', form.location)
    formData.append('status', form.status)
    formData.append('featured', form.featured)
    formData.append('isPublished', form.isPublished)

    if (form.tags) {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t)
      tagsArray.forEach(tag => formData.append('tags', tag))
    }

    newImages.value.forEach(file => {
      formData.append('images', file)
    })

    let result
    if (isEdit.value) {
      result = await projectsStore.updateProject(route.params.id, formData)
    } else {
      result = await projectsStore.createProject(formData)
    }

    if (result.success) {
      router.push('/admin/proyectos')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error al guardar el proyecto'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
      </h1>
      <p class="text-gray-600">
        {{ isEdit ? 'Modifica los datos del proyecto' : 'Crea un nuevo proyecto para la galería' }}
      </p>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-32 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div class="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h2>

        <div>
          <label class="label">Título *</label>
          <input v-model="form.title" type="text" required class="input" />
        </div>

        <div>
          <label class="label">Descripción corta</label>
          <input
            v-model="form.shortDescription"
            type="text"
            maxlength="200"
            class="input"
            placeholder="Breve resumen para tarjetas (máx. 200 caracteres)"
          />
        </div>

        <div>
          <label class="label">Descripción completa *</label>
          <textarea
            v-model="form.description"
            rows="5"
            required
            class="input"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="label">Categoría *</label>
            <select v-model="form.category" required class="input">
              <option value="">Seleccionar categoría</option>
              <option v-for="cat in categoriesStore.categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="label">Ubicación</label>
            <input v-model="form.location" type="text" class="input" placeholder="Ej: Miami, FL" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="label">Estado</label>
            <select v-model="form.status" class="input">
              <option value="planning">En planificación</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>

          <div>
            <label class="label">Etiquetas</label>
            <input
              v-model="form.tags"
              type="text"
              class="input"
              placeholder="Separadas por coma: moderno, residencial, tropical"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <label class="flex items-center">
            <input v-model="form.featured" type="checkbox" class="rounded border-gray-300 text-primary-600 mr-2" />
            Proyecto destacado
          </label>
          <label class="flex items-center">
            <input v-model="form.isPublished" type="checkbox" class="rounded border-gray-300 text-primary-600 mr-2" />
            Publicado
          </label>
        </div>
      </div>

      <!-- Images -->
      <div class="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Imágenes</h2>

        <!-- Existing images -->
        <div v-if="existingImages.length > 0">
          <label class="label mb-2">Imágenes actuales</label>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="image in existingImages"
              :key="image._id"
              class="relative group"
            >
              <img :src="image.url" class="h-24 w-full object-cover rounded-lg" />
              <button
                type="button"
                @click="removeExistingImage(image._id)"
                class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- New images upload -->
        <div>
          <label class="label mb-2">Agregar nuevas imágenes</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <PhotoIcon class="h-12 w-12 mx-auto text-gray-400" />
            <p class="mt-2 text-gray-600">Arrastra imágenes aquí o</p>
            <label class="btn-secondary mt-2 cursor-pointer inline-flex">
              Seleccionar archivos
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handleImageChange"
                class="hidden"
              />
            </label>
          </div>

          <!-- Preview new images -->
          <div v-if="imagePreviews.length > 0" class="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="(preview, index) in imagePreviews"
              :key="index"
              class="relative group"
            >
              <img :src="preview" class="h-24 w-full object-cover rounded-lg" />
              <button
                type="button"
                @click="removeNewImage(index)"
                class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4">
        <router-link to="/admin/proyectos" class="btn-secondary">
          Cancelar
        </router-link>
        <button type="submit" :disabled="saving" class="btn-primary">
          {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Proyecto') }}
        </button>
      </div>
    </form>
  </div>
</template>
