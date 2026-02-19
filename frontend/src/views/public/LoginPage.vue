<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''

  const result = await authStore.login(form.email, form.password)

  if (result.success) {
    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } else {
    error.value = result.error
  }

  loading.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2">
          <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-2xl">D&D</span>
          </div>
          <div>
            <span class="text-2xl font-display font-bold text-gray-900">Landscaping</span>
            <span class="text-primary-600 font-semibold ml-1">Pro</span>
          </div>
        </router-link>
        <h2 class="mt-6 text-2xl font-bold text-gray-900">Administration Panel</h2>
        <p class="mt-2 text-gray-600">Enter your credentials to continue</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label class="label">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="your@email.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="label">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>

      <p class="mt-8 text-center text-sm text-gray-500">
        <router-link to="/" class="text-primary-600 hover:text-primary-700">
          ← Back to site
        </router-link>
      </p>
    </div>
  </div>
</template>
