<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const isMenuOpen = ref(false)

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Projects', to: '/proyectos' },
  { name: 'Gallery', to: '/galeria' },
  { name: 'About Us', to: '/nosotros' },
  { name: 'Contact', to: '/contacto' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center space-x-2">
            <img src="/logo puro.png" alt="D&D Landscaping Pro" class="h-10 w-10 object-contain" />
            <div class="hidden sm:block">
              <span class="text-xl font-display font-bold text-gray-900">Landscaping</span>
              <span class="text-primary-600 font-semibold ml-1">Pro</span>
            </div>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :class="[
              'text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'text-primary-600'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            {{ item.name }}
          </RouterLink>
          <RouterLink to="/cotizacion" class="btn-primary text-sm">
            Get a Free Quote
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t">
        <div class="px-4 py-4 space-y-3">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            @click="isMenuOpen = false"
            :class="[
              'block px-4 py-2 rounded-lg text-base font-medium',
              isActive(item.to)
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ item.name }}
          </RouterLink>
          <RouterLink
            to="/cotizacion"
            @click="isMenuOpen = false"
            class="block btn-primary text-center mt-4"
          >
            Get a Free Quote
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>
