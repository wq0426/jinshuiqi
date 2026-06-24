<script setup>
// 分销概览
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getDistOverview, getDistributors, getDistRules } from '@/api'
import { distributorLevelColor } from '@/constants'
import { blueGradient, chartColors } from '@/utils/chartTheme'

// 接口数据，先用空结构占位
const distOverview = ref({
  totalMembers: 0, newMembers: 0, totalCommission: 0, pendingWithdraw: 0,
  trend: { months: [], commission: [], members: [] }, levelDist: []
})
const distributors = ref([])
const distRules = ref([])
onMounted(async () => {
  const [ov, ds, rules] = await Promise.all([getDistOverview(), getDistributors(), getDistRules()])
  distOverview.value = ov
  distributors.value = ds
  distRules.value = rules
})

// 指标卡
const statCards = computed(() => [
  { label: '团队总人数', value: distOverview.value.totalMembers, icon: 'User', gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)' },
  { label: '本月新增', value: distOverview.value.newMembers, icon: 'UserFilled', gradient: 'linear-gradient(135deg,#52c41a,#26C6DA)' },
  { label: '累计佣金', value: distOverview.value.totalCommission, prefix: '¥', icon: 'Wallet', gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
  { label: '待提现', value: distOverview.value.pendingWithdraw, prefix: '¥', icon: 'Money', gradient: 'linear-gradient(135deg,#ff4d4f,#faad14)' }
])

// 佣金 / 会员趋势图（佣金折线 + 会员柱状双轴）
const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['佣金', '会员数'], right: 0, top: 0, icon: 'circle' },
  grid: { left: 60, right: 60, top: 40, bottom: 30 },
  xAxis: {
    type: 'category',
    data: distOverview.value.trend.months,
    axisLine: { lineStyle: { color: '#e4e7ed' } },
    axisLabel: { color: '#909399' }
  },
  yAxis: [
    { type: 'value', name: '佣金', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
    { type: 'value', name: '会员', splitLine: { show: false }, axisLabel: { color: '#909399' } }
  ],
  series: [
    {
      name: '会员数', type: 'bar', yAxisIndex: 1, data: distOverview.value.trend.members,
      barWidth: 22, itemStyle: { borderRadius: [6, 6, 0, 0], color: blueGradient(echarts, '#26C6DA', 'rgba(38,198,218,0.25)') }
    },
    {
      name: '佣金', type: 'line', yAxisIndex: 0, smooth: true, data: distOverview.value.trend.commission,
      symbol: 'circle', symbolSize: 7, itemStyle: { color: '#3A8EF6' }, lineStyle: { width: 3 },
      areaStyle: { color: blueGradient(echarts) }
    }
  ]
}))

// 等级分布饼图
const levelOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} 人 ({d}%)' },
  legend: { bottom: 0, icon: 'circle' },
  color: chartColors,
  series: [
    {
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%' },
      data: distOverview.value.levelDist
    }
  ]
}))

// Top5 分销员
const topDistributors = computed(() =>
  [...distributors.value].sort((a, b) => b.totalCommission - a.totalCommission).slice(0, 5)
)
</script>

<template>
  <div class="page-container">
    <!-- 指标卡 -->
    <el-row :gutter="16">
      <el-col v-for="card in statCards" :key="card.label" :xs="12" :sm="12" :lg="6">
        <StatCard v-bind="card" style="margin-bottom: 16px" />
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16">
      <el-col :lg="16" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">佣金 / 会员趋势</span></div>
          <ChartCard :option="trendOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="8" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">等级分布</span></div>
          <ChartCard :option="levelOption" height="320px" />
        </div>
      </el-col>
    </el-row>

    <!-- Top分销员 + 规则简介 -->
    <el-row :gutter="16">
      <el-col :lg="14" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">佣金榜 Top5</span></div>
          <el-table :data="topDistributors" stripe>
            <el-table-column type="index" label="排名" width="70" align="center">
              <template #default="{ $index }">
                <span class="rank" :class="'rank-' + ($index + 1)">{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="分销员" width="110" />
            <el-table-column label="等级" width="90">
              <template #default="{ row }">
                <el-tag :type="distributorLevelColor[row.level]" effect="light">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="teamSize" label="团队规模" width="100" align="center" />
            <el-table-column label="累计佣金" align="right">
              <template #default="{ row }"><span class="amount">¥{{ row.totalCommission }}</span></template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :lg="10" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">分润规则简介</span></div>
          <div class="rule-list">
            <div v-for="r in distRules" :key="r.id" class="rule-item">
              <div class="rule-badge">{{ r.level }}</div>
              <div class="rule-body">
                <div class="rule-rates">
                  <span>直推 <b>{{ r.directRate }}%</b></span>
                  <span>间推 <b>{{ r.indirectRate }}%</b></span>
                </div>
                <div class="rule-cond">{{ r.upCondition }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

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
.amount {
  color: #ff4d4f;
  font-weight: 600;
}
.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 13px;
  color: #909399;
  background: #f0f2f5;
}
.rank-1 { background: linear-gradient(135deg, #faad14, #ff7a45); color: #fff; }
.rank-2 { background: linear-gradient(135deg, #3a8ef6, #26c6da); color: #fff; }
.rank-3 { background: linear-gradient(135deg, #52c41a, #26c6da); color: #fff; }

.rule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rule-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border: 1px solid #f0f2f5;
  border-radius: 10px;
  transition: all 0.2s;
  &:hover {
    border-color: #3a8ef6;
    box-shadow: 0 4px 12px rgba(58, 142, 246, 0.12);
  }
}
.rule-badge {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
}
.rule-body {
  flex: 1;
  min-width: 0;
}
.rule-rates {
  display: flex;
  gap: 18px;
  font-size: 13px;
  color: #606266;
  b {
    color: #3a8ef6;
    font-size: 16px;
  }
}
.rule-cond {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}
</style>
