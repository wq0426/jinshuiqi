<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="logo">
      <img class="logo-icon" src="/logo.svg" alt="德康泉" />
      <transition name="fade">
        <span v-show="!collapsed" class="logo-text">德康泉管理系统</span>
      </transition>
    </div>
    <el-scrollbar class="menu-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :collapse-transition="false"
        background-color="#1f2533"
        text-color="#b6becd"
        active-text-color="#fff"
        unique-opened
        router
      >
        <template v-for="item in menuConfig" :key="item.path || item.title">
          <!-- 无子菜单 -->
          <el-menu-item v-if="!item.children" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
          <!-- 有子菜单 -->
          <el-sub-menu v-else :index="item.title">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
              @click="onChildClick(child)"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuConfig } from './menu'

defineProps({ collapsed: Boolean })

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)

// 数据大屏等独立路由用新窗口/全屏打开
function onChildClick(child) {
  if (child.blank) {
    const url = router.resolve(child.path).href
    window.open(url, '_blank')
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.sidebar {
  width: 230px;
  height: 100%;
  background: $sidebar-bg;
  transition: width 0.28s;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.collapsed {
    width: 64px;
  }
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .logo-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .logo-text {
    background: linear-gradient(135deg, #3a8ef6 0%, #26c6da 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.menu-scroll {
  flex: 1;
}

.el-menu {
  border-right: none;
}

// 激活项渐变高亮
:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #3a8ef6 0%, #26c6da 100%) !important;
  border-radius: 6px;
  margin: 4px 8px;
}
:deep(.el-menu-item) {
  margin: 4px 8px;
  border-radius: 6px;
  height: 46px;
  line-height: 46px;
}
:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background: $sidebar-bg-light !important;
}
:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
