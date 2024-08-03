import { createRouter, createWebHistory } from 'vue-router'
import HoMe from '../views/HoMe.vue'

const routes = [
  {
    path: '/',
    name: 'HoMe',
    component: HoMe
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashBoard.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/AnalyTics.vue')
  },
  {
    path: '/strategy',
    name: 'Strategy',
    component: () => import('../views/StraTegies.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router