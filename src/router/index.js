import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
import { getInfo } from '@/api/login'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})

// 路由守卫
router.beforeEach((to, from, next) => {
  getInfo().then(response => {
    const code = response.code
    if (code === 401) {
      next('/user')
    }
  })
  next()
})

export default router
