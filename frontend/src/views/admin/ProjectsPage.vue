<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline'

const projectsStore = useProjectsStore()
const showDeleteModal = ref(false)
const projectToDelete = ref(null)

onMounted(async () => {
  await projectsStore.fetchAllProjects()
})

function confirmDelete(project) {
  projectToDelete.value = project
  showDeleteModal.value = true
}

async function deleteProject() {
  if (projectToDelete.value) {
    await projectsStore.deleteProject(projectToDelete.value._id)
    showDeleteModal.value = false
    projectToDelete.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Proyectos</h1>
        <p class="text-gray-600">Gestiona los proyectos de la galería</p>
      </div>
      <RouterLink to="/admin/proyectos/nuevo" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Proyecto
      </RouterLink>
    </div>

    <!-- Loading -->
    <div v-if="projectsStore.loading" class="bg-white rounded-xl shadow">
      <div class="p-6 animate-pulse space-y-4">
        <div v-for="n in 5" :key="n" class="h-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="projectsStore.projects.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
      <FolderIcon class="h-12 w-12 mx-auto text-gray-400" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900">No hay proyectos</h3>
      <p class="text-gray-500">Comienza creando tu primer proyecto</p>
      <RouterLink to="/admin/proyectos/nuevo" class="btn-primary mt-4 inline-flex">
        <PlusIcon class="h-5 w-5 mr-2" />
        Crear Proyecto
      </RouterLink>
    </div>

    <!-- Projects table -->
    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="project in projectsStore.projects" :key="project._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img
                  :src="project.images[0]?.url || 'https://via.placeholder.com/48'"
                  :alt="project.title"
                  class="h-12 w-12 rounded-lg object-cover"
                />
                <div class="ml-4">
                  <p class="font-medium text-gray-900">{{ project.title }}</p>
                  <p class="text-sm text-gray-500">{{ project.location }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ project.category?.name }}
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(project.status)]">
                {{ getStatusLabel(project.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(project.createdAt, { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <RouterLink
                  :to="`/proyectos/${project.slug}`"
                  target="_blank"
                  class="p-2 text-gray-500 hover:text-primary-600"
                  title="Ver"
                >
                  <EyeIcon class="h-5 w-5" />
                </RouterLink>
                <RouterLink
                  :to="`/admin/proyectos/${project._id}/editar`"
                  class="p-2 text-gray-500 hover:text-primary-600"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </RouterLink>
                <button
                  @click="confirmDelete(project)"
                  class="p-2 text-gray-500 hover:text-red-600"
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

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-900">Eliminar Proyecto</h3>
          <p class="mt-2 text-gray-600">
            ¿Estás seguro de que deseas eliminar "{{ projectToDelete?.title }}"?
            Esta acción no se puede deshacer.
          </p>
          <div class="mt-6 flex justify-end gap-4">
            <button @click="showDeleteModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button @click="deleteProject" class="btn bg-red-600 text-white hover:bg-red-700">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
