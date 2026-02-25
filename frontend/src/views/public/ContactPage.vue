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
    error.value = err.response?.data?.error || 'Error sending the message. Please try again.'
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
        <h1 class="text-4xl md:text-5xl font-display font-bold">Contact</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          We're here to help. Contact us and we'll get back to you as soon as possible.
        </p>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Info -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Address</h3>
                  <p class="text-gray-600">8883 fort Jefferson boulevard<br>Orlando, FL 32822</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Phone</h3>
                  <p class="text-gray-600">
                    <a href="tel:+14072672978" class="hover:text-primary-600">(407) 267-2978</a>
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Email</h3>
                  <p class="text-gray-600 space-y-1">
                    <!-- <a href="mailto:infolandscaping@ddlandscapingpro.com" class="block hover:text-primary-600">infolandscaping@ddlandscapingpro.com</a> -->
                    <a href="mailto:diegopenaranda@ddlandscapingpro.com" class="block hover:text-primary-600">
                      diegopenaranda@ddlandscapingpro.com
                    </a>
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ClockIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Business Hours</h3>
                  <p class="text-gray-600">
                    Monday - Friday: 8:00 AM - 6:00 PM<br>
                    Saturday: 9:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            <!-- Map placeholder -->
            <div class="mt-8 h-64 bg-gray-200 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.9209839481978!2d-81.271985922865!3d28.481926175747486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e763f43a18dd75%3A0x8eb2c3e8a3915bb0!2s8883%20Fort%20Jefferson%20Blvd%2C%20Orlando%2C%20FL%2032822%2C%20EE.%20UU.!5e0!3m2!1ses!2sco!4v1772030243150!5m2!1ses!2sco"
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
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

            <div v-if="success" class="mb-6 p-4 bg-green-50 rounded-lg flex items-start">
              <CheckCircleIcon class="h-6 w-6 text-green-500 flex-shrink-0" />
              <div class="ml-3">
                <h3 class="text-green-800 font-semibold">Message sent!</h3>
                <p class="text-green-700">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-6">
              <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
                {{ error }}
              </div>

              <div>
                <label class="label">Full name *</label>
                <input v-model="form.name" type="text" required class="input" />
              </div>

              <div>
                <label class="label">Email *</label>
                <input v-model="form.email" type="email" required class="input" />
              </div>

              <div>
                <label class="label">Phone</label>
                <input v-model="form.phone" type="tel" class="input" />
              </div>

              <div>
                <label class="label">Message *</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  class="input"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <div>
                <label class="label">Attach files (optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  @change="handleFileChange"
                  class="input"
                />
                <p class="text-sm text-gray-500 mt-1">Images or PDFs (max. 5 files)</p>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn-primary w-full"
              >
                <span v-if="loading">Sending...</span>
                <span v-else>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
