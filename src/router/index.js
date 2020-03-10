import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
// import store from '../store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
// import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { getInfo } from '@/api/login'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const defaultRoutePath = '/dashboard/workplace'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})

// 路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  // console.log(Vue.ls.get(ACCESS_TOKEN))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      next()
      // if (store.getters.roles.length === 0) {
      //   store
      //     .dispatch('GetInfo')
      //     .then(res => {
      //       debugger
      //       console.log('GetInfo:' + res)
      //       const roles = res.result && res.result.role
      //       store.dispatch('GenerateRoutes', { roles }).then(() => {
      //         // 根据roles权限生成可访问的路由表
      //         // 动态添加可访问路由表
      //         router.addRoutes(store.getters.addRouters)
      //         const redirect = decodeURIComponent(from.query.redirect || to.path)
      //         if (to.path === redirect) {
      //           // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //           next({ ...to, replace: true })
      //         } else {
      //           // 跳转到目的路由
      //           next({ path: redirect })
      //         }
      //       })
      //     })
      //     .catch(() => {
      //       notification.error({
      //         message: '错误',
      //         description: '请求用户信息失败，请重试'
      //       })
      //       store.dispatch('Logout').then(() => {
      //         next({ path: '/user/login', query: { redirect: to.fullPath } })
      //       })
      //     })
      // } else {
      //   next()
      // }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
