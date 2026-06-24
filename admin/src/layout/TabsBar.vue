<template>
  <div class="tabs-bar">
    <el-tabs
      v-model="appStore.activeTab"
      type="card"
      closable
      @tab-click="onClick"
      @tab-remove="onRemove"
    >
      <el-tab-pane
        v-for="tab in appStore.tabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        :closable="tab.path !== '/dashboard'"
      />
    </el-tabs>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 路由变化 -> 新增标签
watch(
  () => route.path,
  () => {
    if (route.meta?.title && !route.meta?.hidden) {
      appStore.addTab(route)
    } else if (route.meta?.title) {
      // 详情页也允许出现在 tab
      appStore.addTab(route)
    }
  },
  { immediate: true }
)

function onClick(tab) {
  router.push(tab.props.name)
}

function onRemove(path) {
  appStore.removeTab(path)
  router.push(appStore.activeTab)
}
</script>

<style scoped lang="scss">
.tabs-bar {
  background: #fff;
  padding: 6px 12px 0;
  border-top: 1px solid #f0f0f0;

  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs__nav) {
    border: none;
  }
  :deep(.el-tabs__item) {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    margin-right: 6px;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    color: #5a5e66;
    transition: all 0.2s;
  }
  :deep(.el-tabs__item.is-active) {
    background: linear-gradient(135deg, #3a8ef6 0%, #26c6da 100%);
    color: #fff;
    border-color: transparent;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}
</style>
