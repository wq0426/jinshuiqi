<template>
  <div class="screen">
    <!-- 顶部标题栏 -->
    <header class="screen-header">
      <div class="header-deco left"></div>
      <h1 class="screen-title">净水智服 · 数据可视化大屏</h1>
      <div class="header-deco right"></div>
      <div class="header-time">{{ nowText }}</div>
      <el-button class="back-btn" size="small" round @click="goBack">
        <el-icon><Back /></el-icon> 返回
      </el-button>
    </header>

    <!-- 翻牌核心数字 -->
    <section class="flip-row">
      <div v-for="(item, i) in screenData.flipNumbers" :key="item.label" class="flip-card">
        <div class="flip-value">{{ formatNum(displayNums[i]) }}</div>
        <div class="flip-label">{{ item.label }}</div>
      </div>
    </section>

    <!-- 主体网格 -->
    <main class="screen-grid">
      <!-- 左列 -->
      <div class="grid-col">
        <div class="panel">
          <div class="panel-head"><span class="dot"></span>各城市装机量</div>
          <ChartCard :option="cityOption" height="240px" />
        </div>
        <div class="panel">
          <div class="panel-head"><span class="dot"></span>充值金额走势</div>
          <ChartCard :option="rechargeOption" height="240px" />
        </div>
      </div>

      <!-- 中列 -->
      <div class="grid-col center-col">
        <div class="panel gauge-panel">
          <div class="panel-head"><span class="dot"></span>设备在线率</div>
          <ChartCard :option="gaugeOption" height="260px" />
        </div>
        <div class="panel">
          <div class="panel-head"><span class="dot"></span>客户增长趋势</div>
          <ChartCard :option="customerOption" height="240px" />
        </div>
      </div>

      <!-- 右列 -->
      <div class="grid-col">
        <div class="panel">
          <div class="panel-head"><span class="dot"></span>工单类型分布</div>
          <ChartCard :option="workorderOption" height="240px" />
        </div>
        <div class="panel realtime-panel">
          <div class="panel-head"><span class="dot"></span>实时业务动态</div>
          <div class="rt-table">
            <div class="rt-row rt-head">
              <span>时间</span><span>区域</span><span>类型</span><span>客户</span><span>金额</span>
            </div>
            <div class="rt-body">
              <div class="rt-scroll">
                <div v-for="(r, i) in marqueeList" :key="i" class="rt-row">
                  <span>{{ r.time }}</span>
                  <span class="ellip">{{ r.area }}</span>
                  <span><i class="tag" :class="'tag-' + (i % 5)">{{ r.type }}</i></span>
                  <span>{{ r.customer }}</span>
                  <span class="amount">{{ r.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import ChartCard from '@/components/ChartCard.vue'
import { getScreenData } from '@/api'
import { screenColors } from '@/utils/chartTheme'

const router = useRouter()

// 大屏数据（接口拉取），先用空结构占位，避免初次渲染报错
const screenData = ref({
  flipNumbers: [],
  cityInstall: [],
  rechargeLine: { months: [], amount: [] },
  customerGrowth: { months: [], value: [] },
  onlineRate: 0,
  workorderType: [],
  realtimeList: []
})

// ====== 实时时钟 ======
const nowText = ref('')
let clockTimer = null
function updateClock() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  nowText.value = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} 星期${week} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ====== 翻牌数字 count-up 动画 ======
const displayNums = ref([])
let rafId = null
function animateNumbers() {
  const start = performance.now()
  const dur = 1600
  const targets = screenData.value.flipNumbers.map((i) => i.value)
  const step = (t) => {
    const p = Math.min((t - start) / dur, 1)
    const ease = 1 - Math.pow(1 - p, 3)
    displayNums.value = targets.map((v) => Math.round(v * ease))
    if (p < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}
function formatNum(n) {
  return Number(n).toLocaleString()
}

// 实时列表复制一份用于无缝滚动
const marqueeList = computed(() => [...screenData.value.realtimeList, ...screenData.value.realtimeList])

function goBack() {
  if (window.history.length > 1) router.back()
  else window.close()
}

onMounted(async () => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  screenData.value = await getScreenData()
  displayNums.value = screenData.value.flipNumbers.map(() => 0)
  animateNumbers()
})
onBeforeUnmount(() => {
  clearInterval(clockTimer)
  cancelAnimationFrame(rafId)
})

// ====== 暗色图表通用配置 ======
const axisLabel = { color: '#7fd3e8' }
const axisLine = { lineStyle: { color: 'rgba(127,211,232,0.3)' } }
const splitLine = { lineStyle: { color: 'rgba(127,211,232,0.08)' } }

// 各城市装机量（柱状）
const cityOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 40, right: 16, top: 20, bottom: 30 },
  xAxis: { type: 'category', data: screenData.value.cityInstall.map((i) => i.name), axisLine, axisLabel, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel, splitLine },
  series: [
    {
      type: 'bar', data: screenData.value.cityInstall.map((i) => i.value), barWidth: '46%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00E5FF' },
          { offset: 1, color: 'rgba(0,229,255,0.15)' }
        ])
      }
    }
  ]
}))

// 充值金额走势（面积折线）
const rechargeOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 16, top: 20, bottom: 30 },
  xAxis: { type: 'category', boundaryGap: false, data: screenData.value.rechargeLine.months, axisLine, axisLabel },
  yAxis: { type: 'value', axisLabel, splitLine },
  series: [
    {
      type: 'line', smooth: true, data: screenData.value.rechargeLine.amount, symbol: 'circle', symbolSize: 6,
      itemStyle: { color: '#18FFFF' }, lineStyle: { width: 3, color: '#18FFFF' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(24,255,255,0.45)' },
          { offset: 1, color: 'rgba(24,255,255,0.02)' }
        ])
      }
    }
  ]
}))

// 客户增长（面积折线）
const customerOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: 46, right: 16, top: 20, bottom: 30 },
  xAxis: { type: 'category', boundaryGap: false, data: screenData.value.customerGrowth.months, axisLine, axisLabel },
  yAxis: { type: 'value', axisLabel, splitLine },
  series: [
    {
      type: 'line', smooth: true, data: screenData.value.customerGrowth.value, symbol: 'circle', symbolSize: 6,
      itemStyle: { color: '#7C4DFF' }, lineStyle: { width: 3, color: '#7C4DFF' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(124,77,255,0.5)' },
          { offset: 1, color: 'rgba(124,77,255,0.02)' }
        ])
      }
    }
  ]
}))

// 在线率仪表盘
const gaugeOption = computed(() => ({
  backgroundColor: 'transparent',
  series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      radius: '88%',
      center: ['50%', '56%'],
      progress: { show: true, width: 14, itemStyle: { color: '#00E5FF' } },
      axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(127,211,232,0.15)']] } },
      pointer: { itemStyle: { color: '#18FFFF' }, length: '62%', width: 5 },
      axisTick: { distance: -18, lineStyle: { color: 'rgba(127,211,232,0.4)' } },
      splitLine: { distance: -22, length: 12, lineStyle: { color: 'rgba(127,211,232,0.5)' } },
      axisLabel: { distance: -38, color: '#7fd3e8', fontSize: 11 },
      anchor: { show: true, size: 12, itemStyle: { color: '#18FFFF' } },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: '#18FFFF',
        fontSize: 30,
        fontWeight: 'bold',
        offsetCenter: [0, '40%']
      },
      title: { show: false },
      data: [{ value: screenData.value.onlineRate }]
    }
  ]
}))

// 工单类型（玫瑰图）
const workorderOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, textStyle: { color: '#7fd3e8' }, icon: 'circle' },
  color: screenColors,
  series: [
    {
      type: 'pie', radius: ['25%', '62%'], center: ['50%', '44%'], roseType: 'radius',
      itemStyle: { borderRadius: 4, borderColor: 'rgba(10,22,40,0.6)', borderWidth: 2 },
      label: { color: '#aee9f7', formatter: '{b}\n{c}' },
      labelLine: { lineStyle: { color: 'rgba(127,211,232,0.4)' } },
      data: screenData.value.workorderType
    }
  ]
}))
</script>

<style scoped lang="scss">
.screen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(0, 229, 255, 0.12), transparent 60%),
    radial-gradient(900px 500px at 100% 100%, rgba(124, 77, 255, 0.12), transparent 60%),
    #0a1628;
  color: #cfeefb;
  display: flex;
  flex-direction: column;
  padding: 14px 18px 18px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== 顶部标题 ===== */
.screen-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  margin-bottom: 12px;
}
.screen-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 4px;
  background: linear-gradient(90deg, #18ffff, #3a8ef6, #18ffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 24px rgba(0, 229, 255, 0.35);
}
.header-deco {
  height: 2px;
  width: 200px;
  margin: 0 18px;
  background: linear-gradient(90deg, transparent, #00e5ff);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
  &.right {
    transform: scaleX(-1);
  }
}
.header-time {
  position: absolute;
  left: 8px;
  bottom: 2px;
  font-size: 14px;
  color: #7fd3e8;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}
.back-btn {
  position: absolute;
  right: 0;
  top: 8px;
  background: rgba(0, 229, 255, 0.12);
  border: 1px solid rgba(0, 229, 255, 0.45);
  color: #aef3ff;
  &:hover {
    background: rgba(0, 229, 255, 0.25);
    color: #fff;
  }
}

/* ===== 翻牌数字 ===== */
.flip-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}
.flip-card {
  position: relative;
  padding: 14px 10px;
  text-align: center;
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(0, 229, 255, 0.08), rgba(0, 229, 255, 0.02));
  box-shadow: inset 0 0 18px rgba(0, 229, 255, 0.08);
}
.flip-value {
  font-size: 32px;
  font-weight: 800;
  color: #18ffff;
  text-shadow: 0 0 16px rgba(24, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
.flip-label {
  margin-top: 6px;
  font-size: 13px;
  color: #88c4dc;
}

/* ===== 主体网格 ===== */
.screen-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  min-height: 0;
}
.grid-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}
.panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 12px 14px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0, 229, 255, 0.22);
  background: rgba(13, 31, 56, 0.55);
  box-shadow: 0 0 22px rgba(0, 229, 255, 0.08), inset 0 0 30px rgba(8, 22, 44, 0.6);
  backdrop-filter: blur(2px);
}
.panel-head {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #d6f4ff;
  letter-spacing: 1px;
  margin-bottom: 6px;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    background: #00e5ff;
    box-shadow: 0 0 8px #00e5ff;
  }
}

/* ===== 实时滚动列表 ===== */
.realtime-panel .rt-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.rt-row {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr 0.8fr 0.8fr 0.9fr;
  align-items: center;
  padding: 8px 6px;
  font-size: 13px;
  color: #bfe7f7;
}
.rt-head {
  color: #6fb6cf;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  font-weight: 600;
}
.rt-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.rt-scroll {
  animation: rt-marquee 22s linear infinite;
}
.realtime-panel:hover .rt-scroll {
  animation-play-state: paused;
}
.rt-row:nth-child(odd) {
  background: rgba(0, 229, 255, 0.04);
}
.ellip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.amount {
  color: #18ffff;
  font-weight: 600;
}
.tag {
  font-style: normal;
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid;
}
.tag-0 { color: #00e5ff; border-color: rgba(0, 229, 255, 0.5); }
.tag-1 { color: #64ffda; border-color: rgba(100, 255, 218, 0.5); }
.tag-2 { color: #7c4dff; border-color: rgba(124, 77, 255, 0.5); }
.tag-3 { color: #faad14; border-color: rgba(250, 173, 20, 0.5); }
.tag-4 { color: #3a8ef6; border-color: rgba(58, 142, 246, 0.5); }

@keyframes rt-marquee {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
</style>
