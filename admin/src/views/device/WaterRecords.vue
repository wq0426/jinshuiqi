<script setup>
// 设备-制水记录
import { ref, reactive, computed, onMounted } from 'vue'
import { getWaterRecords, exportCsv } from '@/api'

const list = ref([])
onMounted(async () => { list.value = await getWaterRecords() })
const filters = reactive({ keyword: '' })
const filtered = computed(() => list.value.filter((r) =>
  !filters.keyword || r.deviceSn.includes(filters.keyword) || r.customer.includes(filters.keyword)))
function doExport() {
  exportCsv('制水记录', [
    { prop: 'deviceSn', label: '设备SN' }, { prop: 'customer', label: '客户' },
    { prop: 'date', label: '日期' }, { prop: 'water', label: '制水量(L)' },
    { prop: 'tds', label: '出水TDS' }, { prop: 'inTds', label: '进水TDS' }
  ], filtered.value)
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词"><el-input v-model="filters.keyword" placeholder="设备SN / 客户" clearable style="width:200px" /></el-form-item>
        <el-form-item><el-button @click="doExport">导出 CSV</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-card">
      <el-table :data="filtered" stripe style="width:100%">
        <el-table-column prop="deviceSn" label="设备SN" width="140" />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="date" label="日期" width="140" />
        <el-table-column label="制水量" width="130">
          <template #default="{ row }"><span class="amount">{{ row.water }} L</span></template>
        </el-table-column>
        <el-table-column label="出水 TDS" width="120">
          <template #default="{ row }">{{ row.tds }} ppm</template>
        </el-table-column>
        <el-table-column label="进水 TDS" min-width="120">
          <template #default="{ row }">{{ row.inTds }} ppm</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.amount { color: #3A8EF6; font-weight: 600; }
</style>
