// axios 封装：统一 baseURL、token、响应拆信封、错误提示
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 开发环境走 Vite 代理(/api → localhost:3000)；生产环境直连 HTTPS 域名
const request = axios.create({
  baseURL: import.meta.env.PROD ? 'https://abc.hi.cn/api' : '/api',
  timeout: 15000
})

// 请求拦截：带上 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('jsq_token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

// 响应拦截：拆 { code, message, data } 信封
request.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) return body.data
      ElMessage.error(body.message || '请求失败')
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body
  },
  (err) => {
    // 401：登录态失效，清除并跳转登录页
    if (err.response?.status === 401) {
      localStorage.removeItem('jsq_token')
      localStorage.removeItem('jsq_user')
      ElMessage.error('登录已过期，请重新登录')
      if (!location.hash.includes('/login')) {
        location.hash = '#/login'
      }
      return Promise.reject(err)
    }
    const msg = err.response?.data?.message || err.message || '网络错误'
    ElMessage.error(msg)
    return Promise.reject(err)
  }
)

export default request
