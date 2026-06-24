<script setup>
// 设备-故障记录
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeviceFaults, handleDeviceFault, exportCsv } from '@/api'

const list = ref([])
async function load() { list.value = await getDeviceFaults() }
onMounted(load)
const statusMap = { pending: { t: 'danger', l: '待处理' }, handling: { t: 'warning', l: '处理中' }, resolved: { t: 'success', l: '已解决' } }
const levelMap = { high: { t: 'danger', l: '高' }, mid: { t: 'warning', l: '中' }, low: { t: 'info', l: '低' } }
const filters = reactive({ status: '' })
const filtered = computed(() => list.value.filter((r) => !filters.status || r.status === filters.status))
async function setStatus(row, status) {
  await handleDeviceFault(row.id, status); ElMessage.success('已更新'); load()
}
function doExport() {
  exportCsv('设备故障记录', [
    { prop: 'id', label: '故障单号' }, { prop: 'deviceSn', label: '设备SN' },
    { prop: 'model', label: '型号' }, { prop: 'customer', label: '客户' },
    { prop: 'faultType', label: '故障类型' }, { prop: 'desc', label: '描述' },
    { prop: 'time', label: '上报时间' }
  ], filtered.value)
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-radio-group v-model="filters.status" style="margin-right:16px">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="pending">待处理</el-radio-button>
        <el-radio-button value="handling">处理中</el-radio-button>
        <el-radio-button value="resolved">已解决</el-radio-button>
      </el-radio-group>
      <el-button @click="doExport">导出 CSV</el-button>
    </div>
    <div class="table-card">
      <el-table :data="filtered" stripe style="width:100%">
        <el-table-column prop="id" label="故障单号" width="150" />
        <el-table-column prop="deviceSn" label="设备SN" width="120" />
        <el-table-column prop="model" label="型号" width="130" />
        <el-table-column prop="customer" label="客户" width="100" />
        <el-table-column prop="faultType" label="故障类型" width="120" />
        <el-table-column label="级别" width="80">
          <template #default="{ row }"><el-tag :type="levelMap[row.level].t" effect="light">{{ levelMap[row.level].l }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="desc" label="故障描述" min-width="160" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="statusMap[row.status].t" effect="light">{{ statusMap[row.status].l }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" label="上报时间" width="150" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" link type="warning" @click="setStatus(row, 'handling')">受理</el-button>
            <el-button v-if="row.status !== 'resolved'" link type="success" @click="setStatus(row, 'resolved')">解决</el-button>
            <span v-if="row.status === 'resolved'" style="color:#bbb">已完成</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
