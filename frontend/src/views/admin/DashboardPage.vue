<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import {
  FolderIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const stats = ref({
  projects: 0,
  quotes: 0,
  contacts: 0,
  testimonials: 0
})

const recentQuotes = ref([])
const recentContacts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [quotesRes, contactsRes, projectsRes, testimonialsRes] = await Promise.all([
      api.get('/quotes/admin/all', { params: { limit: 5 } }),
      api.get('/contact/admin/all', { params: { limit: 5 } }),
      api.get('/projects/admin/all', { params: { limit: 1 } }),
      api.get('/testimonials/admin/all', { params: { limit: 1 } })
    ])

    recentQuotes.value = quotesRes.data.data
    recentContacts.value = contactsRes.data.data
    stats.value = {
      projects: projectsRes.data.pagination?.total || 0,
      quotes: quotesRes.data.pagination?.total || 0,
      contacts: contactsRes.data.pagination?.total || 0,
      testimonials: testimonialsRes.data.pagination?.total || 0
    }
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Bienvenido, {{ authStore.user?.name }}
      </h1>
      <p class="text-gray-600">Panel de administración de D&D Landscaping Pro</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-primary-100 rounded-lg">
            <FolderIcon class="h-6 w-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Proyectos</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.projects }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-accent-100 rounded-lg">
            <DocumentTextIcon class="h-6 w-6 text-accent-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Cotizaciones</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.quotes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <EnvelopeIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Mensajes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.contacts }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <ChatBubbleLeftRightIcon class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Testimonios</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.testimonials }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Quotes -->
      <div class="bg-white rounded-xl shadow">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Cotizaciones Recientes</h2>
          <RouterLink to="/admin/cotizaciones" class="text-sm text-primary-600 hover:text-primary-700">
            Ver todas →
          </RouterLink>
        </div>
        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div class="h-12 bg-gray-100 rounded"></div>
            <div class="h-12 bg-gray-100 rounded"></div>
            <div class="h-12 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div v-else-if="recentQuotes.length === 0" class="p-6 text-center text-gray-500">
          No hay cotizaciones recientes
        </div>
        <ul v-else class="divide-y">
          <li v-for="quote in recentQuotes" :key="quote._id" class="p-4 hover:bg-gray-50">
            <div class="flex justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ quote.name }}</p>
                <p class="text-sm text-gray-500">{{ quote.serviceType }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  quote.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  quote.status === 'quoted' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                ]"
              >
                {{ quote.status }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Recent Contacts -->
      <div class="bg-white rounded-xl shadow">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Mensajes Recientes</h2>
          <RouterLink to="/admin/mensajes" class="text-sm text-primary-600 hover:text-primary-700">
            Ver todos →
          </RouterLink>
        </div>
        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div class="h-12 bg-gray-100 rounded"></div>
            <div class="h-12 bg-gray-100 rounded"></div>
            <div class="h-12 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div v-else-if="recentContacts.length === 0" class="p-6 text-center text-gray-500">
          No hay mensajes recientes
        </div>
        <ul v-else class="divide-y">
          <li v-for="contact in recentContacts" :key="contact._id" class="p-4 hover:bg-gray-50">
            <div class="flex justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ contact.name }}</p>
                <p class="text-sm text-gray-500 truncate max-w-xs">{{ contact.message }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  contact.status === 'responded' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                ]"
              >
                {{ contact.status }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RouterLink
          to="/admin/proyectos/nuevo"
          class="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-center"
        >
          <FolderIcon class="h-8 w-8 mx-auto text-primary-600" />
          <p class="mt-2 text-sm font-medium text-gray-900">Nuevo Proyecto</p>
        </RouterLink>
        <RouterLink
          to="/admin/galeria"
          class="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-center"
        >
          <DocumentTextIcon class="h-8 w-8 mx-auto text-primary-600" />
          <p class="mt-2 text-sm font-medium text-gray-900">Gestionar Galería</p>
        </RouterLink>
        <RouterLink
          to="/admin/testimonios"
          class="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-center"
        >
          <ChatBubbleLeftRightIcon class="h-8 w-8 mx-auto text-primary-600" />
          <p class="mt-2 text-sm font-medium text-gray-900">Ver Testimonios</p>
        </RouterLink>
        <RouterLink
          to="/admin/categorias"
          class="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-center"
        >
          <EnvelopeIcon class="h-8 w-8 mx-auto text-primary-600" />
          <p class="mt-2 text-sm font-medium text-gray-900">Categorías</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
