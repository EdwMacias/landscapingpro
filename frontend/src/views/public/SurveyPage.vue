<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const token = route.params.token

const state = ref('loading') // loading | error | expired | already_completed | form | success
const errorMessage = ref('')
const surveyData = ref(null)

// Form fields
const form = ref({
  name: '',
  email: '',
  rating: 0,
  content: '',
  location: ''
})
const hoveredStar = ref(0)
const submitting = ref(false)
const formError = ref('')

onMounted(async () => {
  try {
    const res = await api.get(`/surveys/${token}`)
    surveyData.value = res.data.data
    form.value.name = surveyData.value.clientName || ''
    form.value.email = surveyData.value.clientEmail || ''
    state.value = 'form'
  } catch (err) {
    const errCode = err.response?.data?.error
    if (errCode === 'already_completed') {
      state.value = 'already_completed'
    } else if (errCode === 'expired') {
      state.value = 'expired'
    } else {
      state.value = 'error'
      errorMessage.value = err.response?.data?.message || 'Invalid or not found survey link.'
    }
  }
})

function setRating(value) {
  form.value.rating = value
}

async function submitSurvey() {
  formError.value = ''
  if (!form.value.name.trim()) {
    formError.value = 'Please enter your name.'
    return
  }
  if (!form.value.rating) {
    formError.value = 'Please select a rating.'
    return
  }
  if (!form.value.content.trim()) {
    formError.value = 'Please write a comment.'
    return
  }

  submitting.value = true
  try {
    await api.post(`/surveys/${token}`, {
      name: form.value.name.trim(),
      rating: form.value.rating,
      content: form.value.content.trim(),
      location: form.value.location.trim() || undefined
    })
    state.value = 'success'
  } catch (err) {
    const errCode = err.response?.data?.error
    if (errCode === 'already_completed') {
      state.value = 'already_completed'
    } else if (errCode === 'expired') {
      state.value = 'expired'
    } else {
      formError.value = err.response?.data?.error || 'An error occurred. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}

function starLabel(n) {
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  return labels[n]
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Simple header -->
    <header class="bg-white border-b border-gray-200 py-4">
      <div class="max-w-2xl mx-auto px-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">D&D</span>
        </div>
        <div>
          <p class="font-bold text-gray-900 leading-tight">D&D Landscaping Pro</p>
          <p class="text-xs text-gray-500">Orlando, Florida</p>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center py-12 px-4">

      <!-- Loading -->
      <div v-if="state === 'loading'" class="text-center">
        <div class="inline-block w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Loading your survey…</p>
      </div>

      <!-- Error states -->
      <div v-else-if="['error', 'expired', 'already_completed'].includes(state)" class="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
             :class="state === 'already_completed' ? 'bg-green-100' : 'bg-amber-100'">
          <svg v-if="state === 'already_completed'" class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          <template v-if="state === 'already_completed'">Survey Already Completed</template>
          <template v-else-if="state === 'expired'">Link Expired</template>
          <template v-else>Link Not Found</template>
        </h2>
        <p class="text-gray-500 text-sm">
          <template v-if="state === 'already_completed'">You've already submitted your feedback. Thank you!</template>
          <template v-else-if="state === 'expired'">This survey link has expired. Please contact us if you'd like to share your feedback.</template>
          <template v-else>{{ errorMessage || 'This survey link is invalid or no longer available.' }}</template>
        </p>
        <a href="https://ddlandscapingpro.com" class="mt-6 inline-block text-green-700 font-medium text-sm hover:underline">
          Visit our website →
        </a>
      </div>

      <!-- Form -->
      <div v-else-if="state === 'form'" class="max-w-lg w-full">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Share Your Experience</h1>
          <p class="text-gray-500 text-sm mb-8">Your feedback helps us improve our services.</p>

          <form @submit.prevent="submitSurvey" class="space-y-5">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Your Name <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="Full name"
              />
            </div>

            <!-- Rating -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Overall Rating <span class="text-red-500">*</span></label>
              <div class="flex items-center gap-1">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  @click="setRating(n)"
                  @mouseenter="hoveredStar = n"
                  @mouseleave="hoveredStar = 0"
                  class="transition-transform hover:scale-110 focus:outline-none"
                >
                  <svg
                    class="w-9 h-9 transition-colors"
                    :class="n <= (hoveredStar || form.rating) ? 'text-yellow-400' : 'text-gray-200'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
                <span v-if="hoveredStar || form.rating" class="ml-2 text-sm font-medium text-gray-600">
                  {{ starLabel(hoveredStar || form.rating) }}
                </span>
              </div>
            </div>

            <!-- Comment -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Your Comments <span class="text-red-500">*</span></label>
              <textarea
                v-model="form.content"
                rows="4"
                maxlength="500"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                placeholder="Tell us about your experience with our service…"
              ></textarea>
              <p class="text-right text-xs text-gray-400 mt-1">{{ form.content.length }}/500</p>
            </div>

            <!-- Location (optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Location <span class="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                v-model="form.location"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="e.g. Orlando, FL"
              />
            </div>

            <!-- Error -->
            <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {{ formError }}
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">Submitting…</span>
              <span v-else>Submit Feedback</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Success -->
      <div v-else-if="state === 'success'" class="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p class="text-gray-500 mb-6">Your feedback has been received and is very important to us. We appreciate you taking the time to share your experience with D&D Landscaping Pro.</p>
        <div class="flex justify-center gap-1 mb-6">
          <svg v-for="n in form.rating" :key="n" class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <a href="https://ddlandscapingpro.com" class="text-green-700 font-medium text-sm hover:underline">
          Visit our website →
        </a>
      </div>

    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-xs text-gray-400">
      &copy; {{ new Date().getFullYear() }} D&D Landscaping Pro LLC — Orlando, Florida
    </footer>
  </div>
</template>
