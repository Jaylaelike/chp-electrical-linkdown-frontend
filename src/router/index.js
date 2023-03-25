import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Electrical Dashboard' },
      component: HomeView
    },
    {
      path: '/create',
      name: 'create',
      meta: { title: 'เพิ่มข้อมูลไฟฟ้าดับ' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/update/:id',
      name: 'update',
      component: () => import('../views/UpdateView.vue'),
      meta: { title: 'แก้ไขข้อมูลไฟฟ้าดับ' }
    },
    {
      path: '/link',
      name: 'link',
      meta: { title: 'Link NT Down Dashboard' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LinkdownHomeView.vue')
    },
    {
      path: '/linkcreate',
      name: 'linkcreate',
      meta: { title: 'เพิ่มข้อมูล Link NT Down' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LinkdownCreateView.vue')
    },
    {
      path: '/linkupdate/:id',
      name: 'linkupdate',
      meta: { title: 'แก้ไขข้อมูล Link NT Down' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LinkdownUpdateView.vue')
    }
  
  
  ]
})

export default router
