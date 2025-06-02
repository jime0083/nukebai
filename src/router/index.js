import { createRouter, createWebHistory } from 'vue-router'
import { getFirebaseAuth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Page components
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/RegisterPage.vue'
import SearchPage from '../views/reviews/SearchPage.vue'
import ReviewFormPage from '../views/reviews/ReviewFormPage.vue'
import ReviewDetailPage from '../views/reviews/ReviewDetailPage.vue'
import AccountPage from '../views/account/AccountPage.vue'
import SubscriptionPage from '../views/account/SubscriptionPage.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import NotFoundPage from '../views/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/review/new',
    name: 'review-new',
    component: ReviewFormPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/:id',
    name: 'review-detail',
    component: ReviewDetailPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/account',
    name: 'account',
    component: AccountPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscription',
    name: 'subscription',
    component: SubscriptionPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = getFirebaseAuth()
  
  onAuthStateChanged(auth, (user) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)
    
    // Check if route requires authentication and user is not logged in
    if (requiresAuth && !user) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // Check if route requires admin role
    if (requiresAdmin) {
      // Here you would check if user has admin role
      // For simplicity, we're just checking if user exists
      if (!user) {
        next({ name: 'home' })
        return
      }
      
      // In a real app, you would check user's role from Firestore
      // For example: if (!userIsAdmin) next({ name: 'home' })
    }
    
    // Check if route is for guests only and user is logged in
    if (guestOnly && user) {
      next({ name: 'home' })
      return
    }
    
    next()
  })
})

export default router