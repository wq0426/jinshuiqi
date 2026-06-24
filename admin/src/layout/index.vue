<template>
  <div class="layout">
    <Sidebar :collapsed="appStore.sidebarCollapsed" />
    <div class="main">
      <Header />
      <TabsBar />
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import TabsBar from './TabsBar.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100%;
  width: 100%;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}
</style>
