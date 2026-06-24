import { defineStore } from 'pinia'
import { login as loginApi } from '@/api'

// 用户登录态 store（持久化到 localStorage）
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('jsq_token') || '',
    userInfo: JSON.parse(localStorage.getItem('jsq_user') || 'null') || {
      name: '',
      role: '',
      avatar: ''
    }
  }),
  getters: {
    isLogin: (state) => !!state.token
  },
  actions: {
    // 登录：调用后端接口
    async login(username, password) {
      const data = await loginApi({ username, password })
      this.token = data.token
      this.userInfo = {
        name: data.user?.nickname || username || '管理员',
        role: data.user?.role || '超级管理员',
        avatar: data.user?.avatar || ''
      }
      localStorage.setItem('jsq_token', this.token)
      localStorage.setItem('jsq_user', JSON.stringify(this.userInfo))
    },
    logout() {
      this.token = ''
      this.userInfo = { name: '', role: '', avatar: '' }
      localStorage.removeItem('jsq_token')
      localStorage.removeItem('jsq_user')
    }
  }
})
