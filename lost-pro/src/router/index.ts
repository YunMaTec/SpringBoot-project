import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/Index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    redirect:'/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    name:'main',
    path: '/main',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/layout/dashboard.vue'),
        meta:{
          title:'首页'
        }
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/Admin.vue'),
        meta:{
          title:'管理员管理'
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/User.vue'),
        meta:{
          title:'用户管理'
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import('@/views/Menu.vue'),
        meta:{
          title:'菜单管理'
        }
      },
      {
        path: '/category',
        name: 'category',
        component: () => import('@/views/Category.vue'),
        meta:{
          title:'物品分类'
        }
      },
      {
        path: '/lost',
        name: 'lost',
        component: () => import('@/views/Lost.vue'),
        meta:{
          title:'失物列表'
        }
      },
      {
        path: '/claim',
        name: 'claim',
        component: () => import('@/views/Claim.vue'),
        meta:{
          title:'招领列表'
        }
      },
      {
        path: '/lostOrder',
        name: 'lostOrder',
        component: () => import('@/views/LostOrder.vue'),
        meta:{
          title:'失物订单'
        }
      },
      {
        path: '/claimOrder',
        name: 'claimOrder',
        component: () => import('@/views/ClaimOrder.vue'),
        meta:{
          title:'招领订单'
        }
      }
      ,
      {
        path: '/advert',
        name: 'advert',
        component: () => import('@/views/Advert.vue'),
        meta:{
          title:'广告管理'
        }
      },
      {
        path: '/feedback',
        name: 'feedback',
        component: () => import('@/views/Feedback.vue'),
        meta:{
          title:'反馈管理'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router