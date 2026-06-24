<template>
  <div class="header">
    <div class="left">
      <el-icon class="collapse-btn" @click="appStore.toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-tooltip content="数据大屏" placement="bottom">
        <el-icon class="action-icon" @click="openScreen"><Monitor /></el-icon>
      </el-tooltip>
      <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
        <el-icon class="action-icon" @click="toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>
      <el-badge :value="5" class="badge-icon">
        <el-icon class="action-icon"><Bell /></el-icon>
      </el-badge>
      <el-dropdown @command="onCommand">
        <div class="user-info">
          <el-avatar :size="32" class="avatar">
            {{ userStore.userInfo.name?.charAt(0) || 'A' }}
          </el-avatar>
          <span class="username">{{ userStore.userInfo.name || '管理员' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon> 个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon> 系统设置
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const currentTitle = computed(() => route.meta?.title || '工作台')

const isFullscreen = ref(false)
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function openScreen() {
  window.open(router.resolve('/data-screen').href, '_blank')
}

function onCommand(cmd) {
  if (cmd === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    })
  } else if (cmd === 'settings') {
    router.push('/system/settings')
  } else {
    ElMessage.info('个人中心（演示）')
  }
}
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #5a5e66;
  &:hover {
    color: #3a8ef6;
  }
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-icon {
  font-size: 19px;
  cursor: pointer;
  color: #5a5e66;
  &:hover {
    color: #3a8ef6;
  }
}

.badge-icon {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  &:hover {
    background: #f5f7fa;
  }
  .avatar {
    background: linear-gradient(135deg, #3a8ef6 0%, #26c6da 100%);
    color: #fff;
    font-weight: 600;
  }
  .username {
    font-size: 14px;
    color: #303133;
  }
}
</style>
