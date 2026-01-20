<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-200">404</h1>
      <h2 class="mt-4 text-2xl font-bold text-gray-900">Página no encontrada</h2>
      <p class="mt-2 text-gray-600">Lo sentimos, la página que buscas no existe.</p>
      <RouterLink to="/" class="btn-primary mt-6 inline-flex">
        Volver al inicio
      </RouterLink>
    </div>
  </div>
</template>
