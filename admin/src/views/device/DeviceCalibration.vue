<script setup>
// 设备-设备校准记录
import { ref, onMounted } from 'vue'
import { getDeviceCalibrations, exportCsv } from '@/api'

const list = ref([])
onMounted(async () => { list.value = await getDeviceCalibrations() })
function doExport() {
  exportCsv('设备校准记录', [
    { prop: 'id', label: '校准单号' }, { prop: 'deviceSn', label: '设备SN' },
    { prop: 'model', label: '型号' }, { prop: 'tdsBefore', label: '校准前TDS' },
    { prop: 'tdsAfter', label: '校准后TDS' }, { prop: 'operator', label: '操作人' },
    { prop: 'result', label: '结果' }, { prop: 'time', label: '时间' }
  ], list.value)
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar"><el-button @click="doExport">导出 CSV</el-button></div>
    <div class="table-card">
      <el-table :data="list" stripe style="width:100%">
        <el-table-column prop="id" label="校准单号" width="160" />
        <el-table-column prop="deviceSn" label="设备SN" width="130" />
        <el-table-column prop="model" label="型号" width="140" />
        <el-table-column label="校准前 TDS" width="120">
          <template #default="{ row }">{{ row.tdsBefore }} ppm</template>
        </el-table-column>
        <el-table-column label="校准后 TDS" width="120">
          <template #default="{ row }">{{ row.tdsAfter }} ppm</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column label="结果" width="100">
          <template #default="{ row }"><el-tag :type="row.result === 'pass' ? 'success' : 'danger'" effect="light">{{ row.result === 'pass' ? '合格' : '不合格' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" label="校准时间" min-width="160" />
      </el-table>
    </div>
  </div>
</template>
