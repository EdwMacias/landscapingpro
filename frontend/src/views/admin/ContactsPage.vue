<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const contacts = ref([])
const loading = ref(true)
const filter = ref('')
const showDetailModal = ref(false)
const selectedContact = ref(null)

async function fetchContacts() {
  loading.value = true
  try {
    const params = {}
    if (filter.value) params.status = filter.value
    const response = await api.get('/contact/admin/all', { params })
    contacts.value = response.data.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchContacts)

async function viewDetail(contact) {
  selectedContact.value = contact
  showDetailModal.value = true

  // Mark as read
  if (contact.status === 'new') {
    try {
      await api.get(`/contact/${contact._id}`)
      await fetchContacts()
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

async function updateStatus(status) {
  try {
    await api.put(`/contact/${selectedContact.value._id}`, { status })
    await fetchContacts()
  } catch (error) {
    console.error('Error:', error)
  }
}

async function deleteContact(id) {
  if (confirm('¿Eliminar este mensaje?')) {
    try {
      await api.delete(`/contact/${id}`)
      await fetchContacts()
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Mensajes de Contacto</h1>
      <p class="text-gray-600">Gestiona los mensajes recibidos</p>
    </div>

    <!-- Filter -->
    <div class="mb-6">
      <select v-model="filter" @change="fetchContacts" class="input w-auto">
        <option value="">Todos los estados</option>
        <option value="new">Nuevos</option>
        <option value="read">Leídos</option>
        <option value="responded">Respondidos</option>
        <option value="archived">Archivados</option>
      </select>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="n in 5" :key="n" class="h-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else-if="contacts.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
      <p class="text-gray-500">No hay mensajes</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remitente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensaje</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="contact in contacts"
            :key="contact._id"
            :class="['hover:bg-gray-50', contact.status === 'new' ? 'bg-blue-50' : '']"
          >
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ contact.name }}</p>
              <p class="text-sm text-gray-500">{{ contact.email }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {{ contact.message }}
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(contact.status)]">
                {{ getStatusLabel(contact.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(contact.createdAt, { month: 'short', day: 'numeric' }) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="viewDetail(contact)" class="p-2 text-gray-500 hover:text-primary-600">
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button @click="deleteContact(contact._id)" class="p-2 text-gray-500 hover:text-red-600">
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
      <div v-if="showDetailModal && selectedContact" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Detalle del Mensaje</h3>
            <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">Nombre</label>
                <p class="font-medium">{{ selectedContact.name }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Email</label>
                <p class="font-medium">
                  <a :href="`mailto:${selectedContact.email}`" class="text-primary-600 hover:underline">
                    {{ selectedContact.email }}
                  </a>
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Teléfono</label>
                <p class="font-medium">
                  <a v-if="selectedContact.phone" :href="`tel:${selectedContact.phone}`" class="text-primary-600 hover:underline">
                    {{ selectedContact.phone }}
                  </a>
                  <span v-else>-</span>
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Fecha</label>
                <p class="font-medium">{{ formatDate(selectedContact.createdAt) }}</p>
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-500">Mensaje</label>
              <p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{{ selectedContact.message }}</p>
            </div>

            <div v-if="selectedContact.attachments?.length > 0">
              <label class="text-sm text-gray-500">Archivos adjuntos</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <a
                  v-for="(file, index) in selectedContact.attachments"
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
                  @click="updateStatus('responded')"
                  class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                >
                  Marcar como respondido
                </button>
                <button
                  @click="updateStatus('archived')"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  Archivar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
