<script setup>
import { ref, reactive } from 'vue'
import api from '@/utils/api'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  serviceType: '',
  budget: '',
  timeline: '',
  description: ''
})

const files = ref([])
const loading = ref(false)
const success = ref(false)
const error = ref('')

const serviceTypes = [
  { value: 'landscaping', label: 'Paisajismo completo' },
  { value: 'garden_design', label: 'Diseño de jardines' },
  { value: 'lawn_care', label: 'Cuidado de césped' },
  { value: 'irrigation', label: 'Sistema de riego' },
  { value: 'hardscaping', label: 'Hardscaping (patios, caminos)' },
  { value: 'tree_service', label: 'Servicio de árboles' },
  { value: 'maintenance', label: 'Mantenimiento regular' },
  { value: 'other', label: 'Otro' }
]

const budgetOptions = [
  { value: 'under_1000', label: 'Menos de $1,000' },
  { value: '1000_5000', label: '$1,000 - $5,000' },
  { value: '5000_10000', label: '$5,000 - $10,000' },
  { value: '10000_25000', label: '$10,000 - $25,000' },
  { value: 'over_25000', label: 'Más de $25,000' },
  { value: 'not_sure', label: 'No estoy seguro' }
]

const timelineOptions = [
  { value: 'asap', label: 'Lo antes posible' },
  { value: '1_month', label: 'Dentro de 1 mes' },
  { value: '3_months', label: 'Dentro de 3 meses' },
  { value: '6_months', label: 'Dentro de 6 meses' },
  { value: 'flexible', label: 'Flexible' }
]

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (form[key]) formData.append(key, form[key])
    })

    files.value.forEach(file => {
      formData.append('attachments', file)
    })

    await api.post('/quotes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    success.value = true
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al enviar la solicitud. Intente nuevamente.'
  } finally {
    loading.value = false
  }
}

function handleFileChange(e) {
  files.value = Array.from(e.target.files)
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-5xl font-display font-bold">Solicitar Cotización</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          Cuéntanos sobre tu proyecto y recibirás una cotización personalizada sin compromiso.
        </p>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Success Message -->
        <div v-if="success" class="bg-white rounded-xl shadow-lg p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircleIcon class="h-10 w-10 text-green-500" />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-gray-900">¡Solicitud Enviada!</h2>
          <p class="mt-2 text-gray-600">
            Hemos recibido tu solicitud de cotización. Revisa tu email para la confirmación.
            Nos pondremos en contacto contigo a la brevedad.
          </p>
          <router-link to="/" class="btn-primary mt-6 inline-flex">
            Volver al inicio
          </router-link>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </div>

          <h2 class="text-xl font-bold text-gray-900">Información de Contacto</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Nombre completo *</label>
              <input v-model="form.name" type="text" required class="input" />
            </div>

            <div>
              <label class="label">Email *</label>
              <input v-model="form.email" type="email" required class="input" />
            </div>

            <div>
              <label class="label">Teléfono *</label>
              <input v-model="form.phone" type="tel" required class="input" />
            </div>

            <div>
              <label class="label">Dirección del proyecto</label>
              <input v-model="form.address" type="text" class="input" placeholder="Ciudad, Estado" />
            </div>
          </div>

          <hr class="my-8" />

          <h2 class="text-xl font-bold text-gray-900">Detalles del Proyecto</h2>

          <div>
            <label class="label">Tipo de servicio *</label>
            <select v-model="form.serviceType" required class="input">
              <option value="">Seleccione una opción</option>
              <option v-for="type in serviceTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Presupuesto estimado</label>
              <select v-model="form.budget" class="input">
                <option value="">Seleccione una opción</option>
                <option v-for="option in budgetOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">Línea de tiempo</label>
              <select v-model="form.timeline" class="input">
                <option value="">Seleccione una opción</option>
                <option v-for="option in timelineOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="label">Descripción del proyecto *</label>
            <textarea
              v-model="form.description"
              rows="5"
              required
              class="input"
              placeholder="Describe tu proyecto: tamaño del área, características deseadas, problemas actuales, etc."
            ></textarea>
          </div>

          <div>
            <label class="label">Adjuntar archivos (opcional)</label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              @change="handleFileChange"
              class="input"
            />
            <p class="text-sm text-gray-500 mt-1">
              Sube fotos del área, planos o imágenes de referencia (máx. 5 archivos)
            </p>
          </div>

          <div class="bg-primary-50 p-4 rounded-lg">
            <p class="text-sm text-primary-800">
              <strong>Nota:</strong> Tu información es confidencial y solo será utilizada para
              preparar tu cotización. Nos pondremos en contacto en un plazo de 24-48 horas hábiles.
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            <span v-if="loading">Enviando solicitud...</span>
            <span v-else>Enviar Solicitud de Cotización</span>
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
