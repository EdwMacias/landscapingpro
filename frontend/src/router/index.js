import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Public layouts and views
import PublicLayout from '@/views/public/PublicLayout.vue'
import HomePage from '@/views/public/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage
        },
        {
          path: 'proyectos',
          name: 'projects',
          component: () => import('@/views/public/ProjectsPage.vue')
        },
        {
          path: 'proyectos/:slug',
          name: 'project-detail',
          component: () => import('@/views/public/ProjectDetailPage.vue')
        },
        {
          path: 'galeria',
          name: 'gallery',
          component: () => import('@/views/public/GalleryPage.vue')
        },
        {
          path: 'nosotros',
          name: 'about',
          component: () => import('@/views/public/AboutPage.vue')
        },
        {
          path: 'contacto',
          name: 'contact',
          component: () => import('@/views/public/ContactPage.vue')
        },
        {
          path: 'cotizacion',
          name: 'quote',
          component: () => import('@/views/public/QuotePage.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/LoginPage.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardPage.vue')
        },
        {
          path: 'proyectos',
          name: 'admin-projects',
          component: () => import('@/views/admin/ProjectsPage.vue')
        },
        {
          path: 'proyectos/nuevo',
          name: 'admin-project-new',
          component: () => import('@/views/admin/ProjectFormPage.vue')
        },
        {
          path: 'proyectos/:id/editar',
          name: 'admin-project-edit',
          component: () => import('@/views/admin/ProjectFormPage.vue')
        },
        {
          path: 'galeria',
          name: 'admin-gallery',
          component: () => import('@/views/admin/GalleryPage.vue')
        },
        {
          path: 'categorias',
          name: 'admin-categories',
          component: () => import('@/views/admin/CategoriesPage.vue')
        },
        {
          path: 'testimonios',
          name: 'admin-testimonials',
          component: () => import('@/views/admin/TestimonialsPage.vue')
        },
        {
          path: 'cotizaciones',
          name: 'admin-quotes',
          component: () => import('@/views/admin/QuotesPage.vue')
        },
        {
          path: 'mensajes',
          name: 'admin-contacts',
          component: () => import('@/views/admin/ContactsPage.vue')
        },
        {
          path: 'usuarios',
          name: 'admin-users',
          component: () => import('@/views/admin/UsersPage.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/public/NotFoundPage.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'admin-dashboard' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
