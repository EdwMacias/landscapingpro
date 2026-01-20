<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { CheckIcon, XMarkIcon, TrashIcon, StarIcon } from '@heroicons/vue/24/solid'

const testimonials = ref([])
const loading = ref(true)
const filter = ref('')

async function fetchTestimonials() {
  loading.value = true
  try {
    const params = {}
    if (filter.value) params.status = filter.value
    const response = await api.get('/testimonials/admin/all', { params })
    testimonials.value = response.data.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTestimonials)

async function updateStatus(id, status) {
  try {
    await api.put(`/testimonials/${id}`, { status })
    await fetchTestimonials()
  } catch (error) {
    console.error('Error:', error)
  }
}

async function toggleFeatured(testimonial) {
  try {
    await api.put(`/testimonials/${testimonial._id}`, { featured: !testimonial.featured })
    await fetchTestimonials()
  } catch (error) {
    console.error('Error:', error)
  }
}

async function deleteTestimonial(id) {
  if (confirm('¿Eliminar este testimonio?')) {
    try {
      await api.delete(`/testimonials/${id}`)
      await fetchTestimonials()
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Testimonios</h1>
      <p class="text-gray-600">Gestiona los comentarios de clientes</p>
    </div>

    <!-- Filter -->
    <div class="mb-6">
      <select v-model="filter" @change="fetchTestimonials" class="input w-auto">
        <option value="">Todos los estados</option>
        <option value="pending">Pendientes</option>
        <option value="approved">Aprobados</option>
        <option value="rejected">Rechazados</option>
      </select>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="n in 4" :key="n" class="h-24 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else-if="testimonials.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
      <p class="text-gray-500">No hay testimonios</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="testimonial in testimonials"
        :key="testimonial._id"
        class="bg-white rounded-xl shadow p-6"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-gray-900">{{ testimonial.name }}</h3>
              <span :class="['px-2 py-0.5 text-xs rounded-full', getStatusColor(testimonial.status)]">
                {{ getStatusLabel(testimonial.status) }}
              </span>
              <span
                v-if="testimonial.featured"
                class="px-2 py-0.5 text-xs bg-accent-100 text-accent-700 rounded-full"
              >
                Destacado
              </span>
            </div>

            <div class="flex mb-2">
              <StarIcon
                v-for="n in testimonial.rating"
                :key="n"
                class="h-4 w-4 text-accent-500"
              />
            </div>

            <p class="text-gray-600 italic">"{{ testimonial.content }}"</p>

            <div class="mt-2 text-sm text-gray-500">
              <span v-if="testimonial.location">{{ testimonial.location }} • </span>
              {{ formatDate(testimonial.createdAt) }}
            </div>
          </div>

          <div class="flex gap-2 ml-4">
            <button
              v-if="testimonial.status === 'pending'"
              @click="updateStatus(testimonial._id, 'approved')"
              class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="Aprobar"
            >
              <CheckIcon class="h-5 w-5" />
            </button>
            <button
              v-if="testimonial.status === 'pending'"
              @click="updateStatus(testimonial._id, 'rejected')"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Rechazar"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
            <button
              @click="toggleFeatured(testimonial)"
              :class="[
                'p-2 rounded-lg',
                testimonial.featured ? 'text-accent-600 bg-accent-50' : 'text-gray-400 hover:bg-gray-50'
              ]"
              title="Destacar"
            >
              <StarIcon class="h-5 w-5" />
            </button>
            <button
              @click="deleteTestimonial(testimonial._id)"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="Eliminar"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
