<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { formatDate, getServiceTypeLabel, getBudgetLabel, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { EyeIcon, TrashIcon, XMarkIcon, EnvelopeIcon, LinkIcon, ClipboardIcon, CheckIcon } from '@heroicons/vue/24/outline'

const quotes = ref([])
const loading = ref(true)
const filter = ref('')
const showDetailModal = ref(false)
const selectedQuote = ref(null)

// Survey state
const surveyLinks = ref([])
const loadingSurveys = ref(false)
const sendingSurvey = ref(false)
const surveyToast = ref('')
const showSurveyConfirm = ref(false)
const surveyConfirmQuote = ref(null)

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

async function viewDetail(quote) {
  selectedQuote.value = quote
  showDetailModal.value = true
  surveyLinks.value = []
  loadingSurveys.value = true
  try {
    const res = await api.get(`/surveys/quote/${quote._id}`)
    surveyLinks.value = res.data.data
  } catch (error) {
    console.error('Error fetching surveys:', error)
  } finally {
    loadingSurveys.value = false
  }
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

function confirmSendSurvey(quote) {
  surveyConfirmQuote.value = quote
  showSurveyConfirm.value = true
}

async function sendSurvey() {
  if (!surveyConfirmQuote.value) return
  sendingSurvey.value = true
  showSurveyConfirm.value = false
  try {
    await api.post(`/surveys/generate/${surveyConfirmQuote.value._id}`)
    surveyToast.value = `Survey sent to ${surveyConfirmQuote.value.email}`
    setTimeout(() => { surveyToast.value = '' }, 4000)
    // If detail modal is open for this quote, reload surveys
    if (selectedQuote.value?._id === surveyConfirmQuote.value._id) {
      const res = await api.get(`/surveys/quote/${surveyConfirmQuote.value._id}`)
      surveyLinks.value = res.data.data
    }
  } catch (error) {
    surveyToast.value = 'Error sending survey. Please try again.'
    setTimeout(() => { surveyToast.value = '' }, 4000)
    console.error('Error sending survey:', error)
  } finally {
    sendingSurvey.value = false
    surveyConfirmQuote.value = null
  }
}

function getSurveyStatusColor(status) {
  if (status === 'completed') return 'bg-green-100 text-green-700'
  if (status === 'expired') return 'bg-red-100 text-red-700'
  return 'bg-yellow-100 text-yellow-700'
}

// ── Direct Survey Link ─────────────────────────────────────────────────────
const showDirectModal = ref(false)
const directStep = ref('form') // 'form' | 'result'
const directForm = ref({ clientName: '', clientEmail: '', clientPhone: '' })
const directFormError = ref('')
const directCreating = ref(false)
const directResult = ref(null) // { surveyUrl, clientName, clientPhone }
const copied = ref(false)

function openDirectModal() {
  directForm.value = { clientName: '', clientEmail: '', clientPhone: '' }
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
    const res = await api.post('/surveys/generate-direct', {
      clientName: directForm.value.clientName.trim(),
      clientEmail: directForm.value.clientEmail.trim() || undefined,
      clientPhone: directForm.value.clientPhone.trim() || undefined
    })
    directResult.value = {
      surveyUrl: res.data.data.surveyUrl,
      clientName: res.data.data.clientName,
      clientPhone: res.data.data.clientPhone
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
    await navigator.clipboard.writeText(directResult.value.surveyUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {
    // fallback
    const el = document.createElement('textarea')
    el.value = directResult.value.surveyUrl
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  }
}

function whatsappUrl() {
  const msg = `Hi ${directResult.value.clientName}! 😊 Thank you for choosing D&D Landscaping Pro! We'd love to hear about your experience. Please take a moment to share your feedback:\n${directResult.value.surveyUrl}`
  const phone = directResult.value.clientPhone?.replace(/\D/g, '') || ''
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Cotizaciones</h1>
        <p class="text-gray-600">Gestiona las solicitudes de cotización</p>
      </div>
      <button
        @click="openDirectModal"
        class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-600 whitespace-nowrap"
      >
        <LinkIcon class="h-4 w-4" />
        Direct Survey Link
      </button>
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
                <button
                  @click="confirmSendSurvey(quote)"
                  :disabled="sendingSurvey"
                  title="Send satisfaction survey"
                  class="p-2 text-gray-500 hover:text-green-700 disabled:opacity-50"
                >
                  <EnvelopeIcon class="h-5 w-5" />
                </button>
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

    <!-- Toast notification -->
    <Teleport to="body">
      <div
        v-if="surveyToast"
        class="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm transition-all"
      >
        {{ surveyToast }}
      </div>
    </Teleport>

    <!-- Survey Confirm Modal -->
    <Teleport to="body">
      <div v-if="showSurveyConfirm && surveyConfirmQuote" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Send Satisfaction Survey</h3>
          <p class="text-gray-600 text-sm mb-1">A survey email will be sent to:</p>
          <p class="font-medium text-gray-900 mb-1">{{ surveyConfirmQuote.name }}</p>
          <p class="text-green-700 text-sm mb-5">{{ surveyConfirmQuote.email }}</p>
          <p class="text-xs text-gray-400 mb-5">The link will expire in 30 days. The client's response will appear as a pending testimonial for your review.</p>
          <div class="flex gap-3">
            <button
              @click="showSurveyConfirm = false; surveyConfirmQuote = null"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="sendSurvey"
              class="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-600"
            >
              Send Survey
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Direct Survey Link Modal -->
    <Teleport to="body">
      <div v-if="showDirectModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full">

          <!-- Header -->
          <div class="p-5 border-b flex items-center justify-between">
            <div class="flex items-center gap-2">
              <LinkIcon class="h-5 w-5 text-green-700" />
              <h3 class="text-base font-semibold text-gray-900">Direct Survey Link</h3>
            </div>
            <button @click="showDirectModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Step: Form -->
          <div v-if="directStep === 'form'" class="p-5 space-y-4">
            <p class="text-sm text-gray-500">Create a survey link for a client you reached via WhatsApp or in person.</p>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Client Name <span class="text-red-500">*</span></label>
              <input
                v-model="directForm.clientName"
                type="text"
                placeholder="e.g. John Smith"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email <span class="text-gray-400 font-normal">(optional — pre-fills the survey form)</span>
              </label>
              <input
                v-model="directForm.clientEmail"
                type="email"
                placeholder="client@email.com"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number <span class="text-gray-400 font-normal">(optional — for direct WA button)</span>
              </label>
              <input
                v-model="directForm.clientPhone"
                type="tel"
                placeholder="e.g. +14074567890"
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
                Cancel
              </button>
              <button
                @click="createDirectLink"
                :disabled="directCreating"
                class="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-60"
              >
                <span v-if="directCreating">Creating…</span>
                <span v-else>Generate Link</span>
              </button>
            </div>
          </div>

          <!-- Step: Result -->
          <div v-else-if="directStep === 'result'" class="p-5 space-y-4">
            <div class="flex items-center gap-2 text-green-700">
              <CheckIcon class="h-5 w-5" />
              <p class="font-medium text-sm">Link created for <strong>{{ directResult.clientName }}</strong></p>
            </div>

            <!-- URL box -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-2">
              <p class="flex-1 text-xs text-gray-600 break-all font-mono">{{ directResult.surveyUrl }}</p>
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

            <p class="text-xs text-gray-400 -mt-1">This link expires in 30 days.</p>

            <!-- Action buttons -->
            <div class="flex gap-3">
              <button
                @click="copyLink"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                <ClipboardIcon class="h-4 w-4" />
                Copy Link
              </button>
              <a
                :href="whatsappUrl()"
                target="_blank"
                rel="noopener"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-sm hover:bg-[#1ebe5d] font-medium"
              >
                <!-- WhatsApp icon SVG -->
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
              </a>
            </div>

            <button
              @click="directStep = 'form'; directResult = null; directForm = { clientName: '', clientEmail: '', clientPhone: '' }"
              class="w-full text-sm text-gray-500 hover:text-gray-700 pt-1"
            >
              Create another link
            </button>
          </div>

        </div>
      </div>
    </Teleport>

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

            <!-- Survey history -->
            <div class="pt-4 border-t">
              <div class="flex items-center justify-between mb-3">
                <label class="text-sm font-medium text-gray-700">Satisfaction Surveys</label>
                <button
                  @click="confirmSendSurvey(selectedQuote)"
                  class="flex items-center gap-1 px-3 py-1 bg-green-700 text-white rounded-lg text-xs hover:bg-green-600"
                >
                  <EnvelopeIcon class="h-3.5 w-3.5" />
                  Send Survey
                </button>
              </div>
              <div v-if="loadingSurveys" class="text-sm text-gray-400">Loading…</div>
              <div v-else-if="surveyLinks.length === 0" class="text-sm text-gray-400 italic">No surveys sent yet.</div>
              <div v-else class="space-y-2">
                <div
                  v-for="link in surveyLinks"
                  :key="link._id"
                  class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
                >
                  <div>
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getSurveyStatusColor(link.status)]">
                      {{ link.status }}
                    </span>
                    <span class="ml-2 text-gray-500">Sent {{ formatDate(link.sentAt, { month: 'short', day: 'numeric' }) }}</span>
                    <span v-if="link.completedAt" class="ml-2 text-gray-400">· Completed {{ formatDate(link.completedAt, { month: 'short', day: 'numeric' }) }}</span>
                  </div>
                  <div v-if="link.testimonialId" class="text-xs text-gray-500">
                    ⭐ {{ link.testimonialId.rating }} · {{ link.testimonialId.status }}
                  </div>
                </div>
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
