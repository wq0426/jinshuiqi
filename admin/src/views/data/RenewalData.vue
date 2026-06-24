<script setup>
// 数据统计-续费统计（可按时间段筛选）
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getRenewalData, exportCsv } from '@/api'
import { blueGradient } from '@/utils/chartTheme.js'

const data = ref({ trend: { months: [], count: [], rate: [] }, byPackage: [], byArea: [], summary: {}, table: [] })
const range = ref([])
onMounted(async () => { data.value = await getRenewalData() })

const filteredTable = computed(() => {
  if (!range.value || range.value.length !== 2) return data.value.table
  const [s, e] = range.value
  return data.value.table.filter((r) => r.date >= s && r.date <= e)
})

const statCards = computed(() => {
  const s = data.value.summary || {}
  return [
    { label: '累计续费笔数', value: s.renewCount || 0, icon: 'RefreshRight', trend: 9.2 },
    { label: '续费金额', value: (s.renewAmount || 0).toLocaleString(), prefix: '¥', icon: 'Wallet', trend: 11.5, gradient: 'linear-gradient(135deg,#52c41a,#26C6DA)' },
    { label: '续费率', value: s.renewRate || 0, suffix: '%', icon: 'TrendCharts', trend: 3.1, gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
    { label: '即将到期', value: s.expireSoon || 0, icon: 'Warning', trend: -1.2, gradient: 'linear-gradient(135deg,#9254de,#3A8EF6)' }
  ]
})

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['续费笔数', '续费率'], right: 10 },
  grid: { left: 50, right: 50, top: 50, bottom: 30 },
  xAxis: { type: 'category', data: data.value.trend.months, boundaryGap: false },
  yAxis: [{ type: 'value', name: '笔数' }, { type: 'value', name: '续费率(%)', max: 100 }],
  series: [
    { name: '续费笔数', type: 'bar', data: data.value.trend.count, itemStyle: { color: '#3A8EF6', borderRadius: [4, 4, 0, 0] }, barWidth: 18 },
    { name: '续费率', type: 'line', yAxisIndex: 1, smooth: true, data: data.value.trend.rate, itemStyle: { color: '#faad14' }, areaStyle: { color: blueGradient(echarts) } }
  ]
}))
const pieOption = (rows, title) => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{ name: title, type: 'pie', radius: ['40%', '65%'], data: rows, label: { formatter: '{b}: {d}%' } }]
})

function doExport() {
  exportCsv('续费统计', [
    { prop: 'date', label: '日期' }, { prop: 'customer', label: '客户' },
    { prop: 'package', label: '套餐' }, { prop: 'amount', label: '续费金额' },
    { prop: 'nextExpire', label: '下次到期' }
  ], filteredTable.value)
}
</script>

<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col v-for="c in statCards" :key="c.label" :xs="12" :lg="6">
        <StatCard v-bind="c" style="margin-bottom:16px" />
      </el-col>
    </el-row>

    <div class="app-card" style="margin-bottom:16px">
      <div class="card-head"><span class="card-title">续费趋势</span></div>
      <ChartCard :option="trendOption" height="300px" />
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <div class="app-card" style="margin-bottom:16px">
          <div class="card-head"><span class="card-title">套餐续费分布</span></div>
          <ChartCard :option="pieOption(data.byPackage, '套餐续费')" height="280px" />
        </div>
      </el-col>
      <el-col :xs="24" :lg="12">
        <div class="app-card" style="margin-bottom:16px">
          <div class="card-head"><span class="card-title">区域续费分布</span></div>
          <ChartCard :option="pieOption(data.byArea, '区域续费')" height="280px" />
        </div>
      </el-col>
    </el-row>

    <div class="table-card">
      <div class="filter-bar">
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="时间段">
            <el-date-picker v-model="range" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始" end-placeholder="结束" />
          </el-form-item>
          <el-form-item><el-button @click="doExport">导出 CSV</el-button></el-form-item>
        </el-form>
      </div>
      <el-table :data="filteredTable" stripe style="width:100%">
        <el-table-column prop="date" label="日期" width="140" />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="package" label="续费套餐" width="140" />
        <el-table-column label="续费金额" width="130">
          <template #default="{ row }"><span class="amount">¥{{ row.amount }}</span></template>
        </el-table-column>
        <el-table-column prop="nextExpire" label="下次到期" min-width="140" />
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.card-head { margin-bottom: 14px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
.amount { color: #ff4d4f; font-weight: 600; }
</style>
