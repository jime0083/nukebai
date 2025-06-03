import { createRouter, createWebHistory } from 'vue-router';
import { getFirebaseAuth, initializeFirebase } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AgeVerification from '../views/AgeVerification.vue';
import SubmitReview from '../views/SubmitReview.vue';
import ReviewDetails from '../views/ReviewDetails.vue';
import Profile from '../views/Profile.vue';
import Subscription from '../views/Subscription.vue';
import NotFound from '../views/NotFound.vue';
import Search from '../views/Search.vue';
import { useUserStore } from '../stores/user';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAge: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/age-verification',
    name: 'AgeVerification',
    component: AgeVerification
  },
  {
    path: '/submit-review',
    name: 'SubmitReview',
    component: SubmitReview,
    meta: { requiresAuth: true, requiresAge: true, requiresPremium: true }
  },
  {
    path: '/review/:id',
    name: 'ReviewDetails',
    component: ReviewDetails,
    meta: { requiresAge: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, requiresAge: true }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: Subscription,
    meta: { requiresAuth: true, requiresAge: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { requiresAuth: true, requiresAge: true, requiresPremium: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Initialize Firebase
initializeFirebase();

// Navigation guards
router.beforeEach((to, from, next) => {
  // Check if route requires age verification
  if (to.meta.requiresAge && !localStorage.getItem('ageVerified')) {
    next({ name: 'AgeVerification', query: { redirect: to.fullPath } });
    return;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
  }

  // Check if route requires premium subscription
  if (to.meta.requiresPremium) {
    const userStore = useUserStore();
    // This check assumes user is authenticated and userStore is populated
    if (userStore.subscriptionStatus !== 'premium' && !userStore.isAdmin) {
      next({ name: 'Subscription', query: { redirect: to.fullPath, reason: 'premium_required' } });
      return;
    }
  }

  next();
});

export default router;