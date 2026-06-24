<template>
  <div class="page-container">
    <!-- 核心指标卡 -->
    <el-row :gutter="16">
      <el-col v-for="card in statCards" :key="card.label" :xs="12" :sm="12" :lg="6">
        <StatCard v-bind="card" style="margin-bottom: 16px" />
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" :model="filter">
        <el-form-item label="装机日期">
          <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="区域">
          <el-select v-model="filter.area" placeholder="全部区域" clearable style="width: 160px">
            <el-option v-for="a in areaOptions" :key="a" :label="a" :value="a" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 图表区 -->
    <el-row :gutter="16">
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">装机趋势</span></div>
          <ChartCard :option="trendOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">各区域装机量</span></div>
          <ChartCard :option="areaOption" height="320px" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :lg="8" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">机型占比</span></div>
          <ChartCard :option="modelOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="16" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">装机明细</span></div>
          <el-table :data="pagedTable" stripe>
            <el-table-column prop="date" label="日期" width="130" />
            <el-table-column prop="area" label="区域" width="110" />
            <el-table-column prop="model" label="机型" />
            <el-table-column prop="count" label="装机量" width="100" align="right" />
            <el-table-column prop="technician" label="装机师傅" width="110" />
          </el-table>
          <div class="pagination-wrap">
            <el-pagination
              v-model:current-page="page"
              :page-size="pageSize"
              :total="filteredTable.length"
              layout="prev, pager, next, total"
              background
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getInstallData } from '@/api'
import { blueGradient, chartColors } from '@/utils/chartTheme'

// 装机数据（接口拉取），先用空结构占位，避免图表初次渲染报错
const installData = ref({ trend: { months: [], count: [] }, byArea: [], byModel: [], table: [] })
onMounted(async () => {
  installData.value = await getInstallData()
})

// 核心指标卡
const statCards = [
  { label: '累计装机', value: 12860, suffix: ' 台', icon: 'Box', trend: 8.6, gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)' },
  { label: '本月装机', value: 680, suffix: ' 台', icon: 'TrendCharts', trend: 11.5, gradient: 'linear-gradient(135deg,#52c41a,#26C6DA)' },
  { label: '日均装机', value: 23, suffix: ' 台', icon: 'Calendar', trend: 3.2, gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
  { label: '装机师傅', value: 48, suffix: ' 人', icon: 'User', trend: 2.1, gradient: 'linear-gradient(135deg,#9254de,#3A8EF6)' }
]

// 筛选
const areaOptions = computed(() => installData.value.byArea.map((i) => i.name))
const filter = ref({ dateRange: [], area: '' })
function handleSearch() {
  page.value = 1
}
function handleReset() {
  filter.value = { dateRange: [], area: '' }
  page.value = 1
}

// 趋势折线
const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: installData.value.trend.months, boundaryGap: false, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
  series: [
    {
      name: '装机量', type: 'line', smooth: true, data: installData.value.trend.count, symbol: 'circle', symbolSize: 7,
      itemStyle: { color: '#3A8EF6' }, lineStyle: { width: 3 }, areaStyle: { color: blueGradient(echarts) }
    }
  ]
}))

// 各区域柱状
const areaOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: installData.value.byArea.map((i) => i.name), axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
  series: [
    {
      type: 'bar', data: installData.value.byArea.map((i) => i.value), barWidth: '46%',
      itemStyle: { borderRadius: [6, 6, 0, 0], color: blueGradient(echarts, '#26C6DA', '#3A8EF6') }
    }
  ]
}))

// 机型占比饼图
const modelOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle' },
  color: chartColors,
  series: [
    {
      type: 'pie', radius: ['42%', '68%'], center: ['50%', '44%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%' },
      data: installData.value.byModel
    }
  ]
}))

// 表格分页（本地）
const page = ref(1)
const pageSize = 8
const filteredTable = computed(() => {
  let list = installData.value.table
  if (filter.value.area) list = list.filter((r) => r.area === filter.value.area)
  return list
})
const pagedTable = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredTable.value.slice(start, start + pageSize)
})
</script>

<style scoped lang="scss">
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2533;
  position: relative;
  padding-left: 12px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: linear-gradient(135deg, #3a8ef6, #26c6da);
  }
}
</style>
