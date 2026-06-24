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
        <el-form-item label="充值日期">
          <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filter.payType" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="p in payOptions" :key="p" :label="p" :value="p" />
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
          <div class="card-head"><span class="card-title">充值金额趋势</span></div>
          <ChartCard :option="trendOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">套餐销量分布</span></div>
          <ChartCard :option="packageOption" height="320px" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :lg="8" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">支付方式占比</span></div>
          <ChartCard :option="payOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="16" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">充值明细</span></div>
          <el-table :data="pagedTable" stripe>
            <el-table-column prop="date" label="日期" width="140" />
            <el-table-column prop="amount" label="充值金额(元)" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="count" label="订单数" width="120" align="right" />
            <el-table-column prop="avgAmount" label="客单价(元)" width="140" align="right">
              <template #default="{ row }">¥{{ row.avgAmount }}</template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrap">
            <el-pagination
              v-model:current-page="page"
              :page-size="pageSize"
              :total="rechargeAnalysis.table.length"
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
import { getRechargeAnalysis } from '@/api'
import { blueGradient, chartColors } from '@/utils/chartTheme'

// 充值数据（接口拉取），先用空结构占位
const rechargeAnalysis = ref({ trend: { months: [], amount: [] }, byPackage: [], payType: [], table: [] })
onMounted(async () => {
  rechargeAnalysis.value = await getRechargeAnalysis()
})

// 核心指标卡
const statCards = [
  { label: '累计充值额', value: 386, prefix: '¥', suffix: ' 万', icon: 'Wallet', trend: 9.3, gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)' },
  { label: '本月充值', value: 32.6, prefix: '¥', suffix: ' 万', icon: 'Coin', trend: 13.2, gradient: 'linear-gradient(135deg,#52c41a,#26C6DA)' },
  { label: '订单数', value: 3610, suffix: ' 单', icon: 'Tickets', trend: 6.8, gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
  { label: '客单价', value: 268, prefix: '¥', icon: 'PriceTag', trend: -1.4, gradient: 'linear-gradient(135deg,#9254de,#3A8EF6)' }
]

// 筛选
const payOptions = computed(() => rechargeAnalysis.value.payType.map((i) => i.name))
const filter = ref({ dateRange: [], payType: '' })
function handleSearch() {
  page.value = 1
}
function handleReset() {
  filter.value = { dateRange: [], payType: '' }
  page.value = 1
}

// 充值金额趋势
const trendOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v) => '¥' + (v / 10000).toFixed(1) + '万' },
  grid: { left: 60, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: rechargeAnalysis.value.trend.months, boundaryGap: false, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399', formatter: (v) => v / 10000 + '万' } },
  series: [
    {
      name: '充值金额', type: 'line', smooth: true, data: rechargeAnalysis.value.trend.amount, symbol: 'circle', symbolSize: 7,
      itemStyle: { color: '#3A8EF6' }, lineStyle: { width: 3 }, areaStyle: { color: blueGradient(echarts) }
    }
  ]
}))

// 套餐销量柱状
const packageOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: rechargeAnalysis.value.byPackage.map((i) => i.name), axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
  series: [
    {
      type: 'bar', data: rechargeAnalysis.value.byPackage.map((i) => i.value), barWidth: '46%',
      itemStyle: { borderRadius: [6, 6, 0, 0], color: blueGradient(echarts, '#26C6DA', '#3A8EF6') }
    }
  ]
}))

// 支付方式环形图
const payOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { bottom: 0, icon: 'circle' },
  color: chartColors,
  series: [
    {
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%' },
      data: rechargeAnalysis.value.payType
    }
  ]
}))

// 表格分页（本地）
const page = ref(1)
const pageSize = 8
const pagedTable = computed(() => {
  const start = (page.value - 1) * pageSize
  return rechargeAnalysis.value.table.slice(start, start + pageSize)
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
