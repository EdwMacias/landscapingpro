<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useCategoriesStore } from '@/stores/categories'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const projectsStore = useProjectsStore()
const categoriesStore = useCategoriesStore()

const selectedCategory = ref('')
const searchQuery = ref('')

onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    categoriesStore.fetchCategories()
  ])
})

watch([selectedCategory, searchQuery], async () => {
  const params = {}
  if (selectedCategory.value) params.category = selectedCategory.value
  if (searchQuery.value) params.search = searchQuery.value
  await projectsStore.fetchProjects(params)
})

async function loadMore() {
  const nextPage = projectsStore.pagination.page + 1
  if (nextPage <= projectsStore.pagination.pages) {
    const params = { page: nextPage }
    if (selectedCategory.value) params.category = selectedCategory.value
    if (searchQuery.value) params.search = searchQuery.value
    await projectsStore.fetchProjects(params)
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-5xl font-display font-bold">Nuestros Proyectos</h1>
        <p class="mt-4 text-lg text-primary-200 max-w-2xl">
          Explora nuestra colección de proyectos completados. Cada trabajo refleja nuestro compromiso con la excelencia.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white border-b sticky top-20 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative w-full md:w-64">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar proyectos..."
              class="input pl-10"
            />
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-2 w-full md:w-auto">
            <FunnelIcon class="h-5 w-5 text-gray-400" />
            <select v-model="selectedCategory" class="input">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categoriesStore.categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="projectsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 6" :key="n" class="card animate-pulse">
            <div class="h-64 bg-gray-200"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="projectsStore.projects.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No se encontraron proyectos.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RouterLink
            v-for="project in projectsStore.projects"
            :key="project._id"
            :to="`/proyectos/${project.slug}`"
            class="card group hover:shadow-xl transition-all duration-300"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                :src="project.images[0]?.url || 'https://via.placeholder.com/400x300'"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 flex gap-2">
                <span class="bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                  {{ project.category?.name }}
                </span>
                <span
                  v-if="project.status === 'in_progress'"
                  class="bg-accent-500 text-white text-sm px-3 py-1 rounded-full"
                >
                  En progreso
                </span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-gray-600 line-clamp-2">
                {{ project.shortDescription || project.description }}
              </p>
              <div class="mt-4 flex items-center text-sm text-gray-500">
                <span v-if="project.location">{{ project.location }}</span>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Load More -->
        <div
          v-if="projectsStore.pagination.page < projectsStore.pagination.pages"
          class="mt-12 text-center"
        >
          <button @click="loadMore" class="btn-secondary">
            Cargar más proyectos
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
