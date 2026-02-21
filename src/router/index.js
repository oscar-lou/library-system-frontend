import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/admin/users', // Updated to match Assignment 3 instructions
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true } // Secures this route
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/booking/create',
      name: 'booking-create',
      component: () => import('../views/BookingView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/booking/:id',
      name: 'view-booking',
      component: () => import('../views/BookingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/booking/:id/update',
      name: 'update-booking',
      component: () => import('../views/BookingView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('../views/ChartsView.vue')
    },
  ],
})

// Navigation Guard for Authentication & Authorization
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  let isAuthenticated = false
  let isAdmin = false

  if (token) {
    try {
      const decoded = jwtDecode(token)
      isAuthenticated = true
      isAdmin = decoded.role === 'admin' 
    } catch (error) {
      localStorage.removeItem('token')
    }
  }

  // Redirect unauthenticated users to login page
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Redirect non-admin users from admin pages
  else if (to.meta.requiresAdmin && !isAdmin) {
    alert("Access Denied: Admin privileges required.")
    next('/') 
  } 
  // Redirect logged-in users away from the login page
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } 
  else {
    next()
  }
})

export default router
