<template>
  <div class="page-container">
    <!-- 核心指标卡 -->
    <el-row :gutter="16">
      <el-col v-for="card in statCards" :key="card.label" :xs="12" :sm="8" :lg="4">
        <StatCard v-bind="card" style="margin-bottom: 16px" />
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16">
      <el-col :lg="16" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head">
            <span class="card-title">营收趋势</span>
            <el-radio-group v-model="trendRange" size="small">
              <el-radio-button label="近7天" />
              <el-radio-button label="近14天" />
            </el-radio-group>
          </div>
          <ChartCard :option="revenueOption" height="320px" />
        </div>
      </el-col>
      <el-col :lg="8" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head">
            <span class="card-title">工单状态分布</span>
          </div>
          <ChartCard :option="statusOption" height="320px" />
        </div>
      </el-col>
    </el-row>

    <!-- 待办 + 最新工单 -->
    <el-row :gutter="16">
      <el-col :lg="8" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head"><span class="card-title">待办事项</span></div>
          <div class="todo-list">
            <div v-for="t in todoList" :key="t.title" class="todo-item">
              <div class="todo-icon" :style="{ background: t.color }">
                <el-icon :size="20"><component :is="t.icon" /></el-icon>
              </div>
              <span class="todo-title">{{ t.title }}</span>
              <span class="todo-count" :style="{ color: t.color }">{{ t.count }}</span>
              <el-icon class="todo-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="16" :md="24">
        <div class="app-card" style="margin-bottom: 16px">
          <div class="card-head">
            <span class="card-title">最新工单</span>
            <el-link type="primary" :underline="false" @click="$router.push('/workorder/list')">
              查看全部
            </el-link>
          </div>
          <el-table :data="latestWorkorders" stripe>
            <el-table-column prop="id" label="工单号" width="160" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="customer" label="客户" width="90" />
            <el-table-column prop="area" label="服务地址" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag size="small" :type="statusTagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="150" />
          </el-table>
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
import {
  getStatCards,
  getRevenueTrend,
  getWorkorderStatus,
  getTodos,
  getLatestWorkorders
} from '@/api'
import { blueGradient, chartColors } from '@/utils/chartTheme'

const trendRange = ref('近14天')

// 工作台数据（接口拉取）
const statCards = ref([])
const revenueTrend = ref({ days: [], revenue: [], recharge: [] })
const workorderStatus = ref([])
const todoList = ref([])
const latestWorkorders = ref([])

onMounted(async () => {
  const [s, r, w, t, l] = await Promise.all([
    getStatCards(),
    getRevenueTrend(),
    getWorkorderStatus(),
    getTodos(),
    getLatestWorkorders()
  ])
  statCards.value = s
  revenueTrend.value = r
  workorderStatus.value = w
  todoList.value = t
  latestWorkorders.value = l
})

function statusTagType(s) {
  return { 待派单: 'warning', 上门中: 'primary', 服务中: '', 已完成: 'success', 已取消: 'info' }[s] || 'info'
}

const revenueOption = computed(() => {
  const len = trendRange.value === '近7天' ? 7 : 14
  const days = revenueTrend.value.days.slice(-len)
  const revenue = revenueTrend.value.revenue.slice(-len)
  const recharge = revenueTrend.value.recharge.slice(-len)
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['营收', '充值'], right: 0, top: 0 },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: days, boundaryGap: false, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#909399' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#909399' } },
    series: [
      {
        name: '营收', type: 'line', smooth: true, data: revenue, symbol: 'circle', symbolSize: 6,
        itemStyle: { color: '#3A8EF6' }, lineStyle: { width: 3 },
        areaStyle: { color: blueGradient(echarts) }
      },
      {
        name: '充值', type: 'line', smooth: true, data: recharge, symbol: 'circle', symbolSize: 6,
        itemStyle: { color: '#26C6DA' }, lineStyle: { width: 3 },
        areaStyle: { color: blueGradient(echarts, '#26C6DA', 'rgba(38,198,218,0.02)') }
      }
    ]
  }
})

const statusOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle' },
  color: chartColors,
  series: [
    {
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%' },
      data: workorderStatus.value
    }
  ]
}))
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
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f5f7fa;
  }
}
.todo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.todo-title {
  flex: 1;
  font-size: 14px;
  color: #303133;
}
.todo-count {
  font-size: 20px;
  font-weight: 700;
}
.todo-arrow {
  color: #c0c4cc;
}
</style>
