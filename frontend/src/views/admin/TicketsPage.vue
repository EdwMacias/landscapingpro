<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { EyeIcon, TrashIcon, XMarkIcon, LinkIcon, ClipboardIcon, CheckIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const tickets = ref([])
const loading = ref(true)
const filter = ref('')
const showDetailModal = ref(false)
const selectedTicket = ref(null)
const notesDraft = ref('')
const savingNotes = ref(false)

async function fetchTickets() {
  loading.value = true
  try {
    const params = {}
    if (filter.value) params.status = filter.value
    const response = await api.get('/tickets/admin/all', { params })
    tickets.value = response.data.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTickets)

function viewDetail(ticket) {
  selectedTicket.value = ticket
  notesDraft.value = ticket.notes || ''
  showDetailModal.value = true
}

async function updateStatus(status) {
  try {
    const res = await api.put(`/tickets/${selectedTicket.value._id}`, { status })
    selectedTicket.value = res.data.data
    await fetchTickets()
  } catch (error) {
    console.error('Error:', error)
  }
}

async function saveNotes() {
  savingNotes.value = true
  try {
    const res = await api.put(`/tickets/${selectedTicket.value._id}`, { notes: notesDraft.value })
    selectedTicket.value = res.data.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    savingNotes.value = false
  }
}

async function deleteTicket(id) {
  if (confirm('¿Eliminar este ticket?')) {
    try {
      await api.delete(`/tickets/${id}`)
      showDetailModal.value = false
      await fetchTickets()
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

// ── Direct Complaint Link ───────────────────────────────────────────────────
const showDirectModal = ref(false)
const directStep = ref('form') // 'form' | 'result'
const directForm = ref({ clientName: '', clientAddress: '', clientEmail: '', clientPhone: '' })
const directFormError = ref('')
const directCreating = ref(false)
const directResult = ref(null) // { complaintUrl, emailSent }
const copied = ref(false)

function openDirectModal() {
  directForm.value = { clientName: '', clientAddress: '', clientEmail: '', clientPhone: '' }
  directFormError.value = ''
  directStep.value = 'form'
  directResult.value = null
  copied.value = false
  showDirectModal.value = true
}

async function createDirectLink() {
  directFormError.value = ''
  if (!directForm.value.clientName.trim()) {
    directFormError.value = 'Client name is required.'
    return
  }
  directCreating.value = true
  try {
    const res = await api.post('/tickets/send-direct-link', {
      clientName: directForm.value.clientName.trim(),
      clientAddress: directForm.value.clientAddress.trim() || undefined,
      clientEmail: directForm.value.clientEmail.trim() || undefined,
      clientPhone: directForm.value.clientPhone.trim() || undefined
    })
    directResult.value = {
      complaintUrl: res.data.data.complaintUrl,
      emailSent: res.data.data.emailSent
    }
    directStep.value = 'result'
  } catch (error) {
    directFormError.value = error.response?.data?.error || 'Error creating link.'
  } finally {
    directCreating.value = false
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(directResult.value.complaintUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {
    const el = document.createElement('textarea')
    el.value = directResult.value.complaintUrl
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quejas</h1>
        <p class="text-gray-600">Gestiona los tickets de quejas de clientes</p>
      </div>
      <button
        @click="openDirectModal"
        class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-600 whitespace-nowrap"
      >
        <LinkIcon class="h-4 w-4" />
        Link Directo
      </button>
    </div>

    <!-- Filter -->
    <div class="mb-6">
      <select v-model="filter" @change="fetchTickets" class="input w-auto">
        <option value="">Todos los estados</option>
        <option value="open">Abiertos</option>
        <option value="in_progress">En progreso</option>
        <option value="resolved">Resueltos</option>
        <option value="closed">Cerrados</option>
      </select>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="n in 5" :key="n" class="h-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else-if="tickets.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
      <p class="text-gray-500">No hay quejas registradas</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="ticket in tickets" :key="ticket._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ ticket.ticketNumber }}</p>
              <p class="text-sm text-gray-500">{{ ticket.subject || '-' }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ ticket.name }}</p>
              <p class="text-sm text-gray-500">{{ ticket.email }}</p>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(ticket.status)]">
                {{ getStatusLabel(ticket.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(ticket.createdAt, { month: 'short', day: 'numeric' }) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="viewDetail(ticket)" class="p-2 text-gray-500 hover:text-primary-600">
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="authStore.isAdmin"
                  @click="deleteTicket(ticket._id)"
                  class="p-2 text-gray-500 hover:text-red-600"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Direct Complaint Link Modal -->
    <Teleport to="body">
      <div v-if="showDirectModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full">

          <div class="p-5 border-b flex items-center justify-between">
            <div class="flex items-center gap-2">
              <LinkIcon class="h-5 w-5 text-green-700" />
              <h3 class="text-base font-semibold text-gray-900">Link Directo de Queja</h3>
            </div>
            <button @click="showDirectModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div v-if="directStep === 'form'" class="p-5 space-y-4">
            <p class="text-sm text-gray-500">Genera un link prellenado para un cliente que reportó un problema por teléfono, WhatsApp o en persona.</p>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente <span class="text-red-500">*</span></label>
              <input
                v-model="directForm.clientName"
                type="text"
                placeholder="ej. John Smith"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección <span class="text-gray-400 font-normal">(opcional)</span></label>
              <input
                v-model="directForm.clientAddress"
                type="text"
                placeholder="Dirección de la propiedad"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email <span class="text-gray-400 font-normal">(opcional — si se ingresa, se envía el link por correo)</span>
              </label>
              <input
                v-model="directForm.clientEmail"
                type="email"
                placeholder="cliente@email.com"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono <span class="text-gray-400 font-normal">(opcional)</span></label>
              <input
                v-model="directForm.clientPhone"
                type="tel"
                placeholder="ej. +14074567890"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div v-if="directFormError" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
              {{ directFormError }}
            </div>

            <div class="flex gap-3 pt-1">
              <button
                @click="showDirectModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="createDirectLink"
                :disabled="directCreating"
                class="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-60"
              >
                <span v-if="directCreating">Generando…</span>
                <span v-else>Generar Link</span>
              </button>
            </div>
          </div>

          <div v-else-if="directStep === 'result'" class="p-5 space-y-4">
            <div class="flex items-center gap-2 text-green-700">
              <CheckIcon class="h-5 w-5" />
              <p class="font-medium text-sm">
                Link generado
                <span v-if="directResult.emailSent">y enviado por email</span>
              </p>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-2">
              <p class="flex-1 text-xs text-gray-600 break-all font-mono">{{ directResult.complaintUrl }}</p>
              <button
                @click="copyLink"
                :title="copied ? 'Copied!' : 'Copy link'"
                class="flex-shrink-0 p-1.5 rounded-md transition-colors"
                :class="copied ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200 text-gray-500'"
              >
                <CheckIcon v-if="copied" class="h-4 w-4" />
                <ClipboardIcon v-else class="h-4 w-4" />
              </button>
            </div>

            <button
              @click="copyLink"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
            >
              <ClipboardIcon class="h-4 w-4" />
              Copiar Link
            </button>

            <button
              @click="directStep = 'form'; directResult = null"
              class="w-full text-sm text-gray-500 hover:text-gray-700 pt-1"
            >
              Generar otro link
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="showDetailModal && selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedTicket.ticketNumber }}</h3>
              <p class="text-sm text-gray-500">{{ selectedTicket.subject || 'Sin asunto' }}</p>
            </div>
            <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">Nombre</label>
                <p class="font-medium">{{ selectedTicket.name }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Email</label>
                <p class="font-medium">{{ selectedTicket.email }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Teléfono</label>
                <p class="font-medium">{{ selectedTicket.phone }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Dirección</label>
                <p class="font-medium">{{ selectedTicket.address }}</p>
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-500">Descripción del problema</label>
              <p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-line">{{ selectedTicket.description }}</p>
            </div>

            <div v-if="selectedTicket.attachments?.length > 0">
              <label class="text-sm text-gray-500">Archivos adjuntos</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <a
                  v-for="(file, index) in selectedTicket.attachments"
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
              <label class="text-sm text-gray-500 mb-2 block">Notas internas</label>
              <textarea
                v-model="notesDraft"
                rows="3"
                class="input"
                placeholder="Notas visibles solo para el equipo"
              ></textarea>
              <button
                @click="saveNotes"
                :disabled="savingNotes"
                class="mt-2 px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-60"
              >
                <span v-if="savingNotes">Guardando…</span>
                <span v-else>Guardar notas</span>
              </button>
            </div>

            <div class="pt-4 border-t">
              <label class="text-sm text-gray-500 mb-2 block">Cambiar estado</label>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="updateStatus('open')"
                  class="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200"
                >
                  Abierto
                </button>
                <button
                  @click="updateStatus('in_progress')"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                >
                  En progreso
                </button>
                <button
                  @click="updateStatus('resolved')"
                  class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                >
                  Resuelto
                </button>
                <button
                  @click="updateStatus('closed')"
                  class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                >
                  Cerrado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
