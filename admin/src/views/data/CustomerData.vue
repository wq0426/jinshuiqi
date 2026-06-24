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
        <el-form-item label="统计日期">
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

    <!-- 增长趋势 -->
    <el-row :gutter="16">
      <el-col :lg="16" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">客户增长趋势</span></div>
          <ChartCard :option="growthOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="8" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">等级分布</span></div>
          <ChartCard :option="levelOption" height="320px" />
        </div>
      </el-col>
    </el-row>

    <!-- 地域 + 活跃度 -->
    <el-row :gutter="16">
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">地域分布</span></div>
          <ChartCard :option="areaOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">活跃度分布</span></div>
          <ChartCard :option="activityOption" height="320px" />
        </div>
      </el-col>
    </el-row>

    <!-- 明细 -->
    <div class="app-card" style="margin-bottom: 16px">
      <div class="card-head"><span class="card-title">客户明细</span></div>
      <el-table :data="pagedTable" stripe>
        <el-table-column prop="date" label="日期" width="160" />
        <el-table-column prop="newCustomer" label="新增客户" align="right" />
        <el-table-column prop="activeCustomer" label="活跃客户" align="right" />
        <el-table-column prop="area" label="区域" width="160" />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getCustomerAnalysis } from '@/api'
import { blueGradient, chartColors } from '@/utils/chartTheme'

// 客户数据（接口拉取），先用空结构占位
const customerAnalysis = ref({ growth: { months: [], total: [], newly: [] }, levelDist: [], areaDist: [], activity: [], table: [] })
onMounted(async () => {
  customerAnalysis.value = await getCustomerAnalysis()
})

// 核心指标卡
const statCards = [
  { label: '总客户', value: 1286, suffix: ' 人', icon: 'UserFilled', trend: 7.2, gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)' },
  { label: '本月新增', value: 86, suffix: ' 人', icon: 'CirclePlus', trend: 7.5, gradient: 'linear-gradient(135deg,#52c41a,#26C6DA)' },
  { label: '活跃客户', value: 580, suffix: ' 人', icon: 'Promotion', trend: 4.1, gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
  { label: '会员数', value: 426, suffix: ' 人', icon: 'Medal', trend: 5.6, gradient: 'linear-gradient(135deg,#9254de,#3A8EF6)' }
]

// 筛选
const areaOptions = computed(() => customerAnalysis.value.areaDist.map((i) => i.name))
const filter = ref({ dateRange: [], area: '' })
function handleSearch() {
  page.value = 1
}
function handleReset() {
  filter.value = { dateRange: [], area: '' }
  page.value = 1
}

// 增长趋势：总数 + 新增
const growthOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['累计客户', '新增客户'], right: 0, top: 0 },
  grid: { left: 50, right: 50, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: customerAnalysis.value.growth.months, boundaryGap: false, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
  yAxis: [
    { type: 'value', name: '累计', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
    { type: 'value', name: '新增', splitLine: { show: false }, axisLabel: { color: '#909399' } }
  ],
  series: [
    {
      name: '累计客户', type: 'line', smooth: true, data: customerAnalysis.value.growth.total, symbol: 'circle', symbolSize: 7,
      itemStyle: { color: '#3A8EF6' }, lineStyle: { width: 3 }, areaStyle: { color: blueGradient(echarts) }
    },
    {
      name: '新增客户', type: 'bar', yAxisIndex: 1, data: customerAnalysis.value.growth.newly, barWidth: '34%',
      itemStyle: { borderRadius: [6, 6, 0, 0], color: '#26C6DA' }
    }
  ]
}))

// 等级分布饼图
const levelOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle' },
  color: chartColors,
  series: [
    {
      type: 'pie', radius: ['42%', '68%'], center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%' },
      data: customerAnalysis.value.levelDist
    }
  ]
}))

// 地域分布：横向柱状
const areaOption = computed(() => {
  const list = [...customerAnalysis.value.areaDist].sort((a, b) => a.value - b.value)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 70, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
    yAxis: { type: 'category', data: list.map((i) => i.name), axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
    series: [
      {
        type: 'bar', data: list.map((i) => i.value), barWidth: '50%',
        itemStyle: { borderRadius: [0, 6, 6, 0], color: blueGradient(echarts, '#3A8EF6', '#26C6DA') },
        label: { show: true, position: 'right', color: '#606266' }
      }
    ]
  }
})

// 活跃度饼图
const activityOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle' },
  color: ['#52c41a', '#faad14', '#ff4d4f'],
  series: [
    {
      type: 'pie', radius: '64%', center: ['50%', '44%'],
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%' },
      data: customerAnalysis.value.activity
    }
  ]
}))

// 表格分页（本地）
const page = ref(1)
const pageSize = 8
const filteredTable = computed(() => {
  let list = customerAnalysis.value.table
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
