import { defineStore } from 'pinia'

// 应用级 store：侧边栏收缩 + 多标签页
export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    // 多标签页，默认含首页
    tabs: [{ title: '工作台', path: '/dashboard' }],
    activeTab: '/dashboard'
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    addTab(route) {
      this.activeTab = route.path
      if (!this.tabs.some((t) => t.path === route.path)) {
        this.tabs.push({
          title: route.meta?.title || route.name || route.path,
          path: route.path
        })
      }
    },
    removeTab(path) {
      const idx = this.tabs.findIndex((t) => t.path === path)
      if (idx === -1) return
      this.tabs.splice(idx, 1)
      if (this.activeTab === path) {
        const next = this.tabs[idx] || this.tabs[idx - 1] || this.tabs[0]
        this.activeTab = next ? next.path : '/dashboard'
      }
    }
  }
})
