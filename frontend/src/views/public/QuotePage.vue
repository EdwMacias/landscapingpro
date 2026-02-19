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
  { value: 'general_maintenance', label: 'General Maintenance' },
  { value: 'garden_design', label: 'Garden Design' },
  { value: 'weed_control', label: 'Weed control and fertilization' },
  { value: 'irrigation', label: 'Irrigation system' },
  { value: 'hardscaping', label: 'Hardscaping' },
  { value: 'tree_pruning', label: 'Tree pruning' },
  { value: 'plant_pruning', label: 'Plant pruning' },
  { value: 'other', label: 'Other' }
]

const budgetOptions = [
  { value: 'under_1000', label: 'Under $1,000' },
  { value: '1000_5000', label: '$1,000 - $5,000' },
  { value: '5000_10000', label: '$5,000 - $10,000' },
  { value: '10000_25000', label: '$10,000 - $25,000' },
  { value: 'over_25000', label: 'Over $25,000' },
  { value: 'not_sure', label: "I'm not sure" }
]

const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '3_months', label: 'Within 3 months' },
  { value: '6_months', label: 'Within 6 months' },
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
    error.value = err.response?.data?.error || 'Error sending the request. Please try again.'
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
        <h1 class="text-4xl md:text-5xl font-display font-bold">Request a Quote</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          Tell us about your project and you'll receive a personalized no-commitment quote.
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
          <h2 class="mt-4 text-2xl font-bold text-gray-900">Request Sent!</h2>
          <p class="mt-2 text-gray-600">
            We have received your quote request. Check your email for confirmation.
            We will get in touch with you shortly.
          </p>
          <router-link to="/" class="btn-primary mt-6 inline-flex">
            Back to Home
          </router-link>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </div>

          <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Full name *</label>
              <input v-model="form.name" type="text" required class="input" />
            </div>

            <div>
              <label class="label">Email *</label>
              <input v-model="form.email" type="email" required class="input" />
            </div>

            <div>
              <label class="label">Phone *</label>
              <input v-model="form.phone" type="tel" required class="input" />
            </div>

            <div>
              <label class="label">Project address</label>
              <input v-model="form.address" type="text" class="input" placeholder="City, State" />
            </div>
          </div>

          <hr class="my-8" />

          <h2 class="text-xl font-bold text-gray-900">Project Details</h2>

          <div>
            <label class="label">Service type *</label>
            <select v-model="form.serviceType" required class="input">
              <option value="">Select an option</option>
              <option v-for="type in serviceTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Estimated budget</label>
              <select v-model="form.budget" class="input">
                <option value="">Select an option</option>
                <option v-for="option in budgetOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">Timeline</label>
              <select v-model="form.timeline" class="input">
                <option value="">Select an option</option>
                <option v-for="option in timelineOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="label">Project description *</label>
            <textarea
              v-model="form.description"
              rows="5"
              required
              class="input"
              placeholder="Describe your project: area size, desired features, current issues, etc."
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
            <p class="text-sm text-gray-500 mt-1">
              Upload photos of the area, blueprints or reference images (max. 5 files)
            </p>
          </div>

          <div class="bg-primary-50 p-4 rounded-lg">
            <p class="text-sm text-primary-800">
              <strong>Note:</strong> Your information is confidential and will only be used to
              prepare your quote. We will contact you within 24-48 business hours.
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            <span v-if="loading">Sending request...</span>
            <span v-else>Submit Quote Request</span>
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
