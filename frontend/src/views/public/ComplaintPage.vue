<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '@/utils/api'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const route = useRoute()

const form = reactive({
  name: '',
  address: '',
  email: '',
  phone: '',
  subject: '',
  description: '',
  dataConsent: false
})

const files = ref([])
const loading = ref(false)
const success = ref(false)
const ticketNumber = ref('')
const error = ref('')

onMounted(() => {
  if (route.query.name) form.name = route.query.name
  if (route.query.address) form.address = route.query.address
  if (route.query.email) form.email = route.query.email
  if (route.query.phone) form.phone = route.query.phone
})

function handleFileChange(e) {
  files.value = Array.from(e.target.files)
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('address', form.address)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('subject', form.subject)
    formData.append('description', form.description)
    formData.append('dataConsent', form.dataConsent)
    if (route.query.name || route.query.email || route.query.phone) {
      formData.append('source', 'direct')
    }

    files.value.forEach(file => {
      formData.append('attachments', file)
    })

    const response = await api.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    ticketNumber.value = response.data.data.ticketNumber
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.error || 'Error submitting your complaint. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-5xl font-display font-bold">File a Complaint</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          We're sorry if we fell short. Tell us what happened and our team will follow up as soon as possible.
        </p>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div v-if="success" class="p-6 bg-green-50 rounded-lg flex items-start">
            <CheckCircleIcon class="h-8 w-8 text-green-500 flex-shrink-0" />
            <div class="ml-4">
              <h3 class="text-green-800 font-semibold text-lg">Complaint received</h3>
              <p class="text-green-700 mt-1">Your ticket number is:</p>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ ticketNumber }}</p>
              <p class="text-green-700 mt-3">
                Please save this number. You can check the status of your complaint anytime at
                <RouterLink to="/ticket-status" class="underline font-medium">Check Ticket Status</RouterLink>.
              </p>
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
              <label class="label">Address *</label>
              <input v-model="form.address" type="text" required class="input" placeholder="Property address for this job" />
            </div>

            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label class="label">Email *</label>
                <input v-model="form.email" type="email" required class="input" />
              </div>

              <div>
                <label class="label">Phone *</label>
                <input v-model="form.phone" type="tel" required class="input" />
              </div>
            </div>

            <div>
              <label class="label">Subject</label>
              <input v-model="form.subject" type="text" class="input" placeholder="Brief summary of the issue" />
            </div>

            <div>
              <label class="label">Describe the problem *</label>
              <textarea
                v-model="form.description"
                rows="5"
                required
                class="input"
                placeholder="Please describe what went wrong with the completed work"
              ></textarea>
            </div>

            <div>
              <label class="label">Attach photos (optional)</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                @change="handleFileChange"
                class="input"
              />
              <p class="text-sm text-gray-500 mt-1">Images or PDFs (max. 5 files)</p>
            </div>

            <div class="flex items-start">
              <input
                id="dataConsent"
                v-model="form.dataConsent"
                type="checkbox"
                required
                class="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="dataConsent" class="ml-3 text-sm text-gray-600">
                I agree that D&D Landscaping Pro may store this information to follow up on my complaint. *
              </label>
            </div>

            <button
              type="submit"
              :disabled="loading || !form.dataConsent"
              class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Submitting...</span>
              <span v-else>Submit Complaint</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
