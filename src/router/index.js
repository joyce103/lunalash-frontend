import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MemberQuery from '../views/MemberQuery.vue'
import AboutView from '../views/AboutView.vue'
import Transaction from '../views/Transaction.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/member',
      name: 'member',
      component: MemberQuery,
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction
    }
  ],
})

export default router
