import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)

  async function fetchCategories() {
    loading.value = true
    try {
      const response = await api.get('/categories')
      categories.value = response.data?.data || []
      return { success: true }
    } catch (error) {
      categories.value = []
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data) {
    try {
      const response = await api.post('/categories', data)
      categories.value.push(response.data.data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear categoría'
      }
    }
  }

  async function updateCategory(id, data) {
    try {
      const response = await api.put(`/categories/${id}`, data)
      const index = categories.value.findIndex(c => c._id === id)
      if (index !== -1) {
        categories.value[index] = response.data.data
      }
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar categoría'
      }
    }
  }

  async function deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter(c => c._id !== id)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar categoría'
      }
    }
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
