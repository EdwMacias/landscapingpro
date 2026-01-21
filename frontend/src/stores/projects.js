import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  async function fetchProjects(params = {}) {
    loading.value = true
    try {
      const response = await api.get('/projects', { params })
      projects.value = response.data?.data || []
      pagination.value = response.data?.pagination || { page: 1, limit: 12, total: 0, pages: 0 }
      return { success: true }
    } catch (error) {
      projects.value = []
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(slug) {
    loading.value = true
    try {
      const response = await api.get(`/projects/${slug}`)
      currentProject.value = response.data.data
      return { success: true, data: response.data.data }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchAllProjects(params = {}) {
    loading.value = true
    try {
      const response = await api.get('/projects/admin/all', { params })
      projects.value = response.data?.data || []
      pagination.value = response.data?.pagination || { page: 1, limit: 12, total: 0, pages: 0 }
      return { success: true }
    } catch (error) {
      projects.value = []
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function createProject(formData) {
    try {
      const response = await api.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear proyecto'
      }
    }
  }

  async function updateProject(id, formData) {
    try {
      const response = await api.put(`/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar proyecto'
      }
    }
  }

  async function deleteProject(id) {
    try {
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter(p => p._id !== id)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar proyecto'
      }
    }
  }

  async function deleteProjectImage(projectId, imageId) {
    try {
      const response = await api.delete(`/projects/${projectId}/images/${imageId}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar imagen'
      }
    }
  }

  return {
    projects,
    currentProject,
    loading,
    pagination,
    fetchProjects,
    fetchProject,
    fetchAllProjects,
    createProject,
    updateProject,
    deleteProject,
    deleteProjectImage
  }
})
