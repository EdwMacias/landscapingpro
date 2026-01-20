<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { formatDate, getServiceTypeLabel, getBudgetLabel, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const quotes = ref([])
const loading = ref(true)
const filter = ref('')
const showDetailModal = ref(false)
const selectedQuote = ref(null)

async function fetchQuotes() {
  loading.value = true
  try {
    const params = {}
    if (filter.value) params.status = filter.value
    const response = await api.get('/quotes/admin/all', { params })
    quotes.value = response.data.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchQuotes)

function viewDetail(quote) {
  selectedQuote.value = quote
  showDetailModal.value = true
}

async function updateStatus(status) {
  try {
    await api.put(`/quotes/${selectedQuote.value._id}`, { status })
    await fetchQuotes()
    showDetailModal.value = false
  } catch (error) {
    console.error('Error:', error)
  }
}

async function deleteQuote(id) {
  if (confirm('¿Eliminar esta cotización?')) {
    try {
      await api.delete(`/quotes/${id}`)
      await fetchQuotes()
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cotizaciones</h1>
      <p class="text-gray-600">Gestiona las solicitudes de cotización</p>
    </div>

    <!-- Filter -->
    <div class="mb-6">
      <select v-model="filter" @change="fetchQuotes" class="input w-auto">
        <option value="">Todos los estados</option>
        <option value="new">Nuevas</option>
        <option value="reviewing">En revisión</option>
        <option value="quoted">Cotizadas</option>
        <option value="accepted">Aceptadas</option>
        <option value="rejected">Rechazadas</option>
        <option value="completed">Completadas</option>
      </select>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="n in 5" :key="n" class="h-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else-if="quotes.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
      <p class="text-gray-500">No hay cotizaciones</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Presupuesto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="quote in quotes" :key="quote._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ quote.name }}</p>
              <p class="text-sm text-gray-500">{{ quote.email }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ getServiceTypeLabel(quote.serviceType) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ getBudgetLabel(quote.budget) || '-' }}
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(quote.status)]">
                {{ getStatusLabel(quote.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(quote.createdAt, { month: 'short', day: 'numeric' }) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="viewDetail(quote)" class="p-2 text-gray-500 hover:text-primary-600">
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button @click="deleteQuote(quote._id)" class="p-2 text-gray-500 hover:text-red-600">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="showDetailModal && selectedQuote" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Detalle de Cotización</h3>
            <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">Nombre</label>
                <p class="font-medium">{{ selectedQuote.name }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Email</label>
                <p class="font-medium">{{ selectedQuote.email }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Teléfono</label>
                <p class="font-medium">{{ selectedQuote.phone }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Dirección</label>
                <p class="font-medium">{{ selectedQuote.address || '-' }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Tipo de servicio</label>
                <p class="font-medium">{{ getServiceTypeLabel(selectedQuote.serviceType) }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Presupuesto</label>
                <p class="font-medium">{{ getBudgetLabel(selectedQuote.budget) || '-' }}</p>
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-500">Descripción</label>
              <p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedQuote.description }}</p>
            </div>

            <div v-if="selectedQuote.attachments?.length > 0">
              <label class="text-sm text-gray-500">Archivos adjuntos</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <a
                  v-for="(file, index) in selectedQuote.attachments"
                  :key="index"
                  :href="file.url"
                  target="_blank"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  {{ file.filename || `Archivo ${index + 1}` }}
                </a>
              </div>
            </div>

            <div class="pt-4 border-t">
              <label class="text-sm text-gray-500 mb-2 block">Cambiar estado</label>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="updateStatus('reviewing')"
                  class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200"
                >
                  En revisión
                </button>
                <button
                  @click="updateStatus('quoted')"
                  class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200"
                >
                  Cotizada
                </button>
                <button
                  @click="updateStatus('accepted')"
                  class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                >
                  Aceptada
                </button>
                <button
                  @click="updateStatus('completed')"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                >
                  Completada
                </button>
                <button
                  @click="updateStatus('rejected')"
                  class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                >
                  Rechazada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
