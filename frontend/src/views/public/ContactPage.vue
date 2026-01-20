<script setup>
import { ref, reactive } from 'vue'
import api from '@/utils/api'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const files = ref([])
const loading = ref(false)
const success = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('message', form.message)

    files.value.forEach(file => {
      formData.append('attachments', file)
    })

    await api.post('/contact', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    success.value = true
    Object.assign(form, { name: '', email: '', phone: '', message: '' })
    files.value = []
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al enviar el mensaje. Intente nuevamente.'
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
        <h1 class="text-4xl md:text-5xl font-display font-bold">Contacto</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          Estamos aquí para ayudarte. Contáctanos y te responderemos a la brevedad.
        </p>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Info -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Dirección</h3>
                  <p class="text-gray-600">123 Landscaping Way<br>Miami, FL 33101</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Teléfono</h3>
                  <p class="text-gray-600">
                    <a href="tel:+13051234567" class="hover:text-primary-600">(305) 123-4567</a>
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Email</h3>
                  <p class="text-gray-600">
                    <a href="mailto:info@ddlandscaping.com" class="hover:text-primary-600">
                      info@ddlandscaping.com
                    </a>
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ClockIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Horario de Atención</h3>
                  <p class="text-gray-600">
                    Lunes - Viernes: 8:00 AM - 6:00 PM<br>
                    Sábado: 9:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            <!-- Map placeholder -->
            <div class="mt-8 h-64 bg-gray-200 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229119.77082894592!2d-80.34971784453983!3d25.782390733805886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style="border:0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>

            <div v-if="success" class="mb-6 p-4 bg-green-50 rounded-lg flex items-start">
              <CheckCircleIcon class="h-6 w-6 text-green-500 flex-shrink-0" />
              <div class="ml-3">
                <h3 class="text-green-800 font-semibold">¡Mensaje enviado!</h3>
                <p class="text-green-700">Gracias por contactarnos. Te responderemos pronto.</p>
              </div>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-6">
              <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
                {{ error }}
              </div>

              <div>
                <label class="label">Nombre completo *</label>
                <input v-model="form.name" type="text" required class="input" />
              </div>

              <div>
                <label class="label">Email *</label>
                <input v-model="form.email" type="email" required class="input" />
              </div>

              <div>
                <label class="label">Teléfono</label>
                <input v-model="form.phone" type="tel" class="input" />
              </div>

              <div>
                <label class="label">Mensaje *</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  class="input"
                  placeholder="¿En qué podemos ayudarte?"
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
                <p class="text-sm text-gray-500 mt-1">Imágenes o PDFs (máx. 5 archivos)</p>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn-primary w-full"
              >
                <span v-if="loading">Enviando...</span>
                <span v-else>Enviar Mensaje</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
