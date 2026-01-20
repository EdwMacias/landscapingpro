<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const categoriesStore = useCategoriesStore()

const showModal = ref(false)
const isEdit = ref(false)
const currentCategory = ref(null)
const saving = ref(false)

const form = reactive({
  name: '',
  description: '',
  icon: 'leaf'
})

const icons = ['leaf', 'flower', 'tree', 'scissors', 'droplet', 'brick', 'tree-pine', 'sun']

onMounted(async () => {
  await categoriesStore.fetchCategories()
})

function openCreate() {
  isEdit.value = false
  currentCategory.value = null
  Object.assign(form, { name: '', description: '', icon: 'leaf' })
  showModal.value = true
}

function openEdit(category) {
  isEdit.value = true
  currentCategory.value = category
  Object.assign(form, {
    name: category.name,
    description: category.description || '',
    icon: category.icon || 'leaf'
  })
  showModal.value = true
}

async function handleSubmit() {
  saving.value = true

  let result
  if (isEdit.value) {
    result = await categoriesStore.updateCategory(currentCategory.value._id, form)
  } else {
    result = await categoriesStore.createCategory(form)
  }

  if (result.success) {
    showModal.value = false
  }

  saving.value = false
}

async function deleteCategory(category) {
  if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
    await categoriesStore.deleteCategory(category._id)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categorías</h1>
        <p class="text-gray-600">Gestiona las categorías de proyectos</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nueva Categoría
      </button>
    </div>

    <div v-if="categoriesStore.loading" class="bg-white rounded-xl shadow p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="n in 4" :key="n" class="h-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icono</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="category in categoriesStore.categories" :key="category._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-gray-500">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 text-gray-500">{{ category.icon }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="openEdit(category)" class="p-2 text-gray-500 hover:text-primary-600">
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button @click="deleteCategory(category)" class="p-2 text-gray-500 hover:text-red-600">
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
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="label">Nombre *</label>
              <input v-model="form.name" type="text" required class="input" />
            </div>

            <div>
              <label class="label">Descripción</label>
              <textarea v-model="form.description" rows="3" class="input"></textarea>
            </div>

            <div>
              <label class="label">Icono</label>
              <select v-model="form.icon" class="input">
                <option v-for="icon in icons" :key="icon" :value="icon">{{ icon }}</option>
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
