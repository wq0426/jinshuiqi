<script setup>
// 充值记录
import { ref, reactive, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getRechargeRecords, getRechargeTrend } from '@/api'
import { rechargeStatusColor } from '@/constants'
import { blueGradient } from '@/utils/chartTheme.js'

const list = ref([])
const rechargeTrend = ref({ days: [], amount: [], count: [] })
onMounted(async () => {
  const [records, trend] = await Promise.all([getRechargeRecords(), getRechargeTrend()])
  list.value = records
  rechargeTrend.value = trend
})
const filters = reactive({ keyword: '', status: '', payType: '' })
const query = reactive({ keyword: '', status: '', payType: '' })
const page = ref(1)
const size = ref(10)

const payOptions = ['微信支付', '支付宝', '余额']
const statusOptions = ['成功', '处理中', '已退款']

const filtered = computed(() =>
  list.value.filter((r) => {
    if (query.keyword && !r.customer.includes(query.keyword) && !r.id.includes(query.keyword)) return false
    if (query.status && r.status !== query.status) return false
    if (query.payType && r.payType !== query.payType) return false
    return true
  })
)
const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

const stat = computed(() => {
  const ok = list.value.filter((r) => r.status === '成功')
  return {
    total: ok.reduce((s, r) => s + r.amount, 0).toLocaleString(),
    count: list.value.length,
    today: (rechargeTrend.value.amount.at(-1) || 0).toLocaleString(),
    avg: ok.length ? Math.round(ok.reduce((s, r) => s + r.amount, 0) / ok.length) : 0
  }
})

const statCards = computed(() => [
  { label: '累计充值金额', value: stat.value.total, prefix: '¥', icon: 'Wallet', trend: 12.4 },
  { label: '今日充值', value: stat.value.today, prefix: '¥', icon: 'TrendCharts', trend: 8.6, gradient: 'linear-gradient(135deg,#52c41a,#26C6DA)' },
  { label: '充值笔数', value: stat.value.count, icon: 'Tickets', trend: 5.1, gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
  { label: '客单价', value: stat.value.avg, prefix: '¥', icon: 'Money', trend: -2.3, gradient: 'linear-gradient(135deg,#9254de,#3A8EF6)' }
])

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['充值金额', '充值笔数'], right: 10 },
  grid: { left: 50, right: 50, top: 50, bottom: 30 },
  xAxis: { type: 'category', data: rechargeTrend.value.days, boundaryGap: false },
  yAxis: [
    { type: 'value', name: '金额' },
    { type: 'value', name: '笔数' }
  ],
  series: [
    { name: '充值金额', type: 'line', smooth: true, data: rechargeTrend.value.amount, areaStyle: { color: blueGradient(echarts) }, itemStyle: { color: '#3A8EF6' } },
    { name: '充值笔数', type: 'bar', yAxisIndex: 1, data: rechargeTrend.value.count, itemStyle: { color: '#26C6DA', borderRadius: [4, 4, 0, 0] }, barWidth: 16 }
  ]
}))

function handleSearch() {
  Object.assign(query, filters)
  page.value = 1
}
function handleReset() {
  Object.assign(filters, { keyword: '', status: '', payType: '' })
  handleSearch()
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
      <div class="card-head"><span class="card-title">充值趋势（近 7 天）</span></div>
      <ChartCard :option="trendOption" height="300px" />
    </div>

    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="客户 / 充值单号" clearable style="width:200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filters.payType" placeholder="全部" clearable style="width:140px">
            <el-option v-for="p in payOptions" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width:120px">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-card">
      <el-table :data="paged" stripe style="width:100%">
        <el-table-column prop="id" label="充值单号" width="130" />
        <el-table-column prop="customer" label="客户" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="package" label="套餐" width="120" />
        <el-table-column label="金额" width="110">
          <template #default="{ row }"><span class="amount">¥{{ row.amount }}</span></template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="110" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><el-tag :type="rechargeStatusColor[row.status]" effect="light">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" label="充值时间" min-width="160" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="page" :page-size="size" :total="filtered.length" layout="total, prev, pager, next, jumper" background />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-head { margin-bottom: 14px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
.amount { color: #ff4d4f; font-weight: 600; }
</style>
