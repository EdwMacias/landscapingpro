<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const users = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEdit = ref(false)
const currentUser = ref(null)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'worker'
})

async function fetchUsers() {
  loading.value = true
  try {
    const response = await api.get('/users')
    users.value = response.data.data
  } catch (err) {
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

function openCreate() {
  isEdit.value = false
  currentUser.value = null
  Object.assign(form, { name: '', email: '', password: '', role: 'worker' })
  error.value = ''
  showModal.value = true
}

function openEdit(user) {
  isEdit.value = true
  currentUser.value = user
  Object.assign(form, {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role
  })
  error.value = ''
  showModal.value = true
}

async function handleSubmit() {
  saving.value = true
  error.value = ''

  try {
    const data = { ...form }
    if (isEdit.value && !data.password) {
      delete data.password
    }

    if (isEdit.value) {
      await api.put(`/users/${currentUser.value._id}`, data)
    } else {
      await api.post('/users', data)
    }

    await fetchUsers()
    showModal.value = false
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al guardar usuario'
  } finally {
    saving.value = false
  }
}

async function toggleActive(user) {
  try {
    await api.put(`/users/${user._id}/toggle-active`)
    await fetchUsers()
  } catch (err) {
    alert(err.response?.data?.error || 'Error al cambiar estado')
  }
}

async function deleteUser(user) {
  if (confirm(`¿Eliminar al usuario "${user.name}"?`)) {
    try {
      await api.delete(`/users/${user._id}`)
      await fetchUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar usuario')
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p class="text-gray-600">Gestiona los usuarios del sistema</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Usuario
      </button>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="n in 4" :key="n" class="h-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <UserCircleIcon class="h-10 w-10 text-gray-400" />
                <div class="ml-3">
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ user.role === 'admin' ? 'Administrador' : 'Trabajador' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button
                @click="toggleActive(user)"
                :disabled="user._id === authStore.user?.id"
                :class="[
                  'px-2 py-1 text-xs rounded-full transition-colors',
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                  user._id === authStore.user?.id ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                ]"
              >
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </button>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  @click="openEdit(user)"
                  class="p-2 text-gray-500 hover:text-primary-600"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="deleteUser(user)"
                  :disabled="user._id === authStore.user?.id"
                  :class="[
                    'p-2',
                    user._id === authStore.user?.id
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-red-600'
                  ]"
                  title="Eliminar"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div class="p-6 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h3>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {{ error }}
            </div>

            <div>
              <label class="label">Nombre *</label>
              <input v-model="form.name" type="text" required class="input" />
            </div>

            <div>
              <label class="label">Email *</label>
              <input v-model="form.email" type="email" required class="input" />
            </div>

            <div>
              <label class="label">
                Contraseña {{ isEdit ? '(dejar vacío para mantener)' : '*' }}
              </label>
              <input
                v-model="form.password"
                type="password"
                :required="!isEdit"
                minlength="6"
                class="input"
              />
            </div>

            <div>
              <label class="label">Rol *</label>
              <select v-model="form.role" required class="input">
                <option value="worker">Trabajador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div class="flex justify-end gap-4 pt-4">
              <button type="button" @click="showModal = false" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="saving" class="btn-primary">
                {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
