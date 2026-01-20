<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  FolderIcon,
  PhotoIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const navigation = computed(() => {
  const items = [
    { name: 'Dashboard', to: '/admin', icon: HomeIcon },
    { name: 'Proyectos', to: '/admin/proyectos', icon: FolderIcon },
    { name: 'Galería', to: '/admin/galeria', icon: PhotoIcon },
    { name: 'Categorías', to: '/admin/categorias', icon: TagIcon },
    { name: 'Testimonios', to: '/admin/testimonios', icon: ChatBubbleLeftRightIcon },
    { name: 'Cotizaciones', to: '/admin/cotizaciones', icon: DocumentTextIcon },
    { name: 'Mensajes', to: '/admin/mensajes', icon: EnvelopeIcon }
  ]

  if (authStore.isAdmin) {
    items.push({ name: 'Usuarios', to: '/admin/usuarios', icon: UsersIcon })
  }

  return items
})

function isActive(path) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-6 border-b">
          <RouterLink to="/admin" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">D&D</span>
            </div>
            <div>
              <span class="text-lg font-display font-bold text-gray-900">Admin</span>
            </div>
          </RouterLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            @click="sidebarOpen = false"
            :class="[
              'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- User section -->
        <div class="p-4 border-t">
          <div class="flex items-center mb-4">
            <UserCircleIcon class="h-10 w-10 text-gray-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
            </div>
          </div>
          <button
            @click="logout"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="bg-white shadow-sm sticky top-0 z-30">
        <div class="flex items-center justify-between px-4 py-4">
          <button
            @click="sidebarOpen = true"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>

          <div class="flex items-center gap-4">
            <RouterLink to="/" target="_blank" class="text-sm text-gray-600 hover:text-primary-600">
              Ver sitio →
            </RouterLink>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
