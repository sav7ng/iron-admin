import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import router from '@/router/index'

// 创建 axi
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000, // 请求超时时间
  withCreddentials: true
})
console.log(process.env.VUE_APP_API_BASE_URL)
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401) {
    // if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '未经授权',
        description: '授权验证失败'
      })
      if (token) {
        store.dispatch('ClearToken').then(() => {
          // setTimeout(() => {
          window.location.reload()
          // }, 800)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['ADMIN-Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const result = response.data
  // const token = Vue.ls.get(ACCESS_TOKEN)
  // console.log(result)
  if (result.code === 401) {
    router.replace({
      path: '/user'
    })
    notification.error({
      message: '未经授权',
      description: '授权验证失败'
    })
    store.dispatch('ClearToken').then(() => {
      window.location.reload()
    })
  }
  return result
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
