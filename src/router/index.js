import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MemberQuery from '../views/MemberQuery.vue'
import AboutView from '../views/AboutView.vue'
import Transaction from '../views/Transaction.vue'
import TransactionQuery from '../views/TransactionQuery.vue'
import CreateTransactionForm from '../views/CreateTransactionForm.vue'
import AccountManagement from '../views/AccountManagement.vue'
import BookingPage from '../views/BookingPage.vue'
import BookingLookup from '../views/BookingLookup.vue'
import Dashboard from '../views/Dashboard.vue'
import AppointmentManagement from '../views/AppointmentManagement.vue'
import ScheduleManagement from '../views/ScheduleManagement.vue'
import OperationCatalogManagement from '../views/OperationCatalogManagement.vue'
import { isLoggedIn } from '@/stores/authState'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/member',
      name: 'member',
      component: MemberQuery,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction,
      meta: { requiresAuth: true },
    },
    {
      path: '/transactionQuery',
      name: 'transactionQuery',
      component: TransactionQuery,
      meta: { requiresAuth: true },
    },
    {
      path: '/createTransaction',
      name: 'createTransaction',
      component: CreateTransactionForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/account',
      name: 'account',
      component: AccountManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingPage,
    },
    {
      path: '/booking/lookup',
      name: 'bookingLookup',
      component: BookingLookup,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: AppointmentManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/scheduleManagement',
      name: 'scheduleManagement',
      component: ScheduleManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/operationCatalogManagement',
      name: 'operationCatalogManagement',
      component: OperationCatalogManagement,
      meta: { requiresAuth: true },
    }
  ],
})

// 未登入時擋掉需要登入的頁面，直接導回登入頁；已登入者不需要再看到登入頁
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { path: '/' }
  }
  if (to.path === '/' && isLoggedIn.value) {
    return { path: '/dashboard' }
  }
  return true
})

export default router
