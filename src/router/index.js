import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MemberQuery from '../views/MemberQuery.vue'
import AboutView from '../views/AboutView.vue'
import Transaction from '../views/Transaction.vue'
import TransactionQuery from '../views/TransactionQuery.vue'
import CreateTransactionForm from '../views/CreateTransactionForm.vue'
import AccountManagement from '../views/AccountManagement.vue'
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
    }
  ],
})

// 未登入時擋掉需要登入的頁面，直接導回登入頁；已登入者不需要再看到登入頁
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { path: '/' }
  }
  if (to.path === '/' && isLoggedIn.value) {
    return { path: '/about' }
  }
  return true
})

export default router
