<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/utils/api'
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const form = reactive({
  ticketNumber: ''
})

const loading = ref(false)
const error = ref('')
const ticket = ref(null)

const steps = ['open', 'in_progress', 'resolved', 'closed']

async function handleSearch() {
  loading.value = true
  error.value = ''
  ticket.value = null

  try {
    const response = await api.get('/tickets/lookup', {
      params: { ticketNumber: form.ticketNumber.trim() }
    })
    ticket.value = response.data.data
  } catch (err) {
    error.value = err.response?.data?.error || 'No ticket found matching that information.'
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
        <h1 class="text-4xl md:text-5xl font-display font-bold">Check Ticket Status</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          Enter your ticket number to see the current status of your complaint.
        </p>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <form @submit.prevent="handleSearch" class="space-y-6">
            <div>
              <label class="label">Ticket Number *</label>
              <input v-model="form.ticketNumber" type="text" required class="input" placeholder="DDPRO20260301" />
            </div>

            <button type="submit" :disabled="loading" class="btn-primary w-full flex items-center justify-center gap-2">
              <MagnifyingGlassIcon class="h-5 w-5" />
              <span v-if="loading">Searching...</span>
              <span v-else>Check Status</span>
            </button>
          </form>

          <div v-if="error" class="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </div>

          <div v-if="ticket" class="mt-8 border-t pt-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <p class="text-sm text-gray-500">Ticket</p>
                <p class="text-lg font-bold text-gray-900">{{ ticket.ticketNumber }}</p>
              </div>
              <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(ticket.status)]">
                {{ getStatusLabel(ticket.status) }}
              </span>
            </div>

            <p v-if="ticket.subject" class="text-gray-700 mb-6">{{ ticket.subject }}</p>

            <div class="flex items-center">
              <template v-for="(step, index) in steps" :key="step">
                <div class="flex flex-col items-center flex-1">
                  <div
                    :class="[
                      'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold',
                      steps.indexOf(ticket.status) >= index ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center">{{ getStatusLabel(step) }}</p>
                </div>
                <div
                  v-if="index < steps.length - 1"
                  :class="['h-1 flex-1 -mt-6', steps.indexOf(ticket.status) > index ? 'bg-primary-600' : 'bg-gray-200']"
                ></div>
              </template>
            </div>

            <p class="text-sm text-gray-500 mt-8">
              Submitted on {{ formatDate(ticket.createdAt) }} &bull; Last updated {{ formatDate(ticket.updatedAt) }}
            </p>
          </div>

          <p class="text-sm text-gray-500 mt-8 text-center">
            Haven't filed a complaint yet?
            <RouterLink to="/complaint" class="text-primary-600 hover:underline font-medium">File one here</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
