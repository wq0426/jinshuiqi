<script setup>
// 系统-操作日志
import { ref, reactive, computed, onMounted } from 'vue'
import { getOpLogs, exportCsv } from '@/api'

const list = ref([])
onMounted(async () => { list.value = await getOpLogs() })
const filters = reactive({ keyword: '', module: '' })
const modules = ['商城管理', '工单管理', '分销管理', '库存管理', '系统设置']
const filtered = computed(() => list.value.filter((r) => {
  if (filters.keyword && !r.user.includes(filters.keyword) && !r.action.includes(filters.keyword)) return false
  if (filters.module && r.module !== filters.module) return false
  return true
}))
function doExport() {
  exportCsv('操作日志', [
    { prop: 'user', label: '操作人' }, { prop: 'module', label: '模块' },
    { prop: 'action', label: '操作' }, { prop: 'ip', label: 'IP' },
    { prop: 'detail', label: '详情' }, { prop: 'time', label: '时间' }
  ], filtered.value)
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词"><el-input v-model="filters.keyword" placeholder="操作人 / 操作" clearable style="width:200px" /></el-form-item>
        <el-form-item label="模块">
          <el-select v-model="filters.module" placeholder="全部" clearable style="width:160px">
            <el-option v-for="m in modules" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button @click="doExport">导出 CSV</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-card">
      <el-table :data="filtered" stripe style="width:100%">
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column prop="user" label="操作人" width="130" />
        <el-table-column prop="module" label="模块" width="130" />
        <el-table-column prop="action" label="操作" min-width="160" />
        <el-table-column prop="detail" label="详情" min-width="160" />
        <el-table-column prop="ip" label="IP 地址" width="150" />
      </el-table>
    </div>
  </div>
</template>
