// Format date
export function formatDate(date, options = {}) {
  if (!date) return ''
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  return new Date(date).toLocaleDateString('es-ES', defaultOptions)
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Truncate text
export function truncate(text, length = 100) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Get service type label
export function getServiceTypeLabel(type) {
  const labels = {
    landscaping: 'Paisajismo',
    garden_design: 'Diseño de Jardines',
    lawn_care: 'Cuidado de Césped',
    irrigation: 'Sistemas de Riego',
    hardscaping: 'Hardscaping',
    tree_service: 'Servicio de Árboles',
    maintenance: 'Mantenimiento',
    other: 'Otro'
  }
  return labels[type] || type
}

// Get budget label
export function getBudgetLabel(budget) {
  const labels = {
    under_1000: 'Menos de $1,000',
    '1000_5000': '$1,000 - $5,000',
    '5000_10000': '$5,000 - $10,000',
    '10000_25000': '$10,000 - $25,000',
    over_25000: 'Más de $25,000',
    not_sure: 'No estoy seguro'
  }
  return labels[budget] || budget
}

// Get status label
export function getStatusLabel(status) {
  const labels = {
    new: 'Nuevo',
    read: 'Leído',
    responded: 'Respondido',
    archived: 'Archivado',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    reviewing: 'En revisión',
    quoted: 'Cotizado',
    accepted: 'Aceptado',
    completed: 'Completado',
    planning: 'En planificación',
    in_progress: 'En progreso'
  }
  return labels[status] || status
}

// Get status color
export function getStatusColor(status) {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    read: 'bg-gray-100 text-gray-800',
    responded: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Debounce function
export function debounce(fn, delay = 300) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
