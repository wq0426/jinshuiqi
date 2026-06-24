<script setup>
// 设备详情页面
import { ref, reactive, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { getDevice, controlDevice } from '@/api'
import { blueGradient } from '@/utils/chartTheme'
import ChartCard from '@/components/ChartCard.vue'

const route = useRoute()
const router = useRouter()

// 设备详情（接口拉取）；先用空默认占位，避免渲染报错
const device = reactive({
  id: '', sn: '', model: '', customer: '', phone: '', area: '',
  online: false, filterLife: 0, tds: 0, inTds: 0, waterToday: 0,
  waterTotal: 0, temperature: 0, lastReport: '', installDate: '',
  power: false, flushing: false, waterCurve: []
})
onMounted(async () => {
  const data = await getDevice(route.params.id)
  Object.assign(device, data)
})

// 出水水质判定
const tdsQuality = computed(() => {
  if (device.tds < 50) return { label: '优', type: 'success' }
  if (device.tds <= 100) return { label: '良', type: 'warning' }
  return { label: '差', type: 'danger' }
})

// 实时状态迷你卡片
const statusCards = computed(() => [
  { label: '出水 TDS', value: device.tds, suffix: ' ppm', icon: 'Filter', gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)', extra: tdsQuality.value.label },
  { label: '进水 TDS', value: device.inTds, suffix: ' ppm', icon: 'WaterCup', gradient: 'linear-gradient(135deg,#9254de,#3A8EF6)' },
  { label: '今日用水量', value: device.waterToday, suffix: ' L', icon: 'Coffee', gradient: 'linear-gradient(135deg,#26C6DA,#52c41a)' },
  { label: '累计用水', value: device.waterTotal, suffix: ' L', icon: 'DataLine', gradient: 'linear-gradient(135deg,#faad14,#ff7a45)' },
  { label: '水温', value: device.temperature, suffix: ' ℃', icon: 'Sunny', gradient: 'linear-gradient(135deg,#ff4d4f,#faad14)' }
])

// 滤芯寿命环形进度颜色
const lifeColor = computed(() => {
  if (device.filterLife > 50) return '#52c41a'
  if (device.filterLife >= 20) return '#faad14'
  return '#ff4d4f'
})

// 用水量曲线
const chartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array.from({ length: 24 }, (_, h) => h + '时'),
    axisLine: { lineStyle: { color: '#e4e7ed' } },
    axisLabel: { color: '#909399' }
  },
  yAxis: {
    type: 'value',
    name: 'L',
    axisLabel: { color: '#909399' },
    splitLine: { lineStyle: { color: '#f0f2f5' } }
  },
  series: [
    {
      name: '用水量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: device.waterCurve,
      lineStyle: { color: '#3A8EF6', width: 2 },
      itemStyle: { color: '#3A8EF6' },
      areaStyle: { color: blueGradient(echarts) }
    }
  ]
}))

// ===== 远程控制面板 =====
let flushTimer = null

// 开关机
async function onPowerChange(val) {
  device.online = val
  await controlDevice(device.id, 'power', val)
  ElMessage.success(`设备已${val ? '开机' : '关机'}`)
}

// 冲洗
function handleFlush() {
  if (device.flushing) return
  if (!device.power) {
    ElMessage.warning('请先开机后再执行冲洗')
    return
  }
  device.flushing = true
  controlDevice(device.id, 'flush', true)
  ElMessage.info('正在冲洗中...')
  flushTimer = setTimeout(() => {
    device.flushing = false
    ElMessage.success('冲洗完成')
  }, 4000)
}

// 复位滤芯
function handleResetFilter() {
  ElMessageBox.confirm('确定要复位滤芯寿命吗？复位后寿命将恢复至 100%。', '滤芯复位', {
    type: 'warning',
    confirmButtonText: '确定复位',
    cancelButtonText: '取消'
  })
    .then(async () => {
      device.filterLife = 100
      await controlDevice(device.id, 'reset')
      ElMessage.success('滤芯已复位，寿命恢复至 100%')
    })
    .catch(() => {})
}

function goBack() {
  router.push('/device/list')
}

onBeforeUnmount(() => {
  if (flushTimer) clearTimeout(flushTimer)
})
</script>

<template>
  <div class="page-container">
    <!-- 头部信息卡 -->
    <div class="app-card header-card">
      <div class="header-left">
        <div class="dev-icon">
          <el-icon :size="30"><Cpu /></el-icon>
        </div>
        <div class="header-info">
          <div class="header-title">
            <span class="sn">{{ device.sn }}</span>
            <el-tag :type="device.online ? 'success' : 'info'" effect="light" round>
              <span class="dot" :class="{ on: device.online }"></span>
              {{ device.online ? '在线' : '离线' }}
            </el-tag>
          </div>
          <div class="header-meta">
            <span>型号：{{ device.model }}</span>
            <el-divider direction="vertical" />
            <span>客户：{{ device.customer }} ({{ device.phone }})</span>
            <el-divider direction="vertical" />
            <span>区域：{{ device.area }}</span>
          </div>
        </div>
      </div>
      <el-button @click="goBack"><el-icon><Back /></el-icon>返回</el-button>
    </div>

    <!-- 实时状态迷你卡片 -->
    <el-row :gutter="16" class="status-row">
      <el-col v-for="c in statusCards" :key="c.label" :xs="12" :sm="8" :md="8" :lg="4">
        <div class="mini-card">
          <div class="mini-icon" :style="{ background: c.gradient }">
            <el-icon :size="22"><component :is="c.icon" /></el-icon>
          </div>
          <div class="mini-body">
            <div class="mini-label">{{ c.label }}</div>
            <div class="mini-value">
              {{ c.value }}<span class="unit">{{ c.suffix }}</span>
              <el-tag v-if="c.extra" :type="tdsQuality.type" size="small" effect="plain" class="quality-tag">
                {{ c.extra }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <!-- 滤芯寿命 -->
      <el-col :xs="24" :md="8" :lg="6">
        <div class="app-card filter-card">
          <div class="card-title">滤芯寿命</div>
          <el-progress
            type="circle"
            :percentage="device.filterLife"
            :width="160"
            :stroke-width="12"
            :color="lifeColor"
          >
            <template #default="{ percentage }">
              <div class="circle-inner">
                <div class="circle-num" :style="{ color: lifeColor }">{{ percentage }}%</div>
                <div class="circle-text">剩余寿命</div>
              </div>
            </template>
          </el-progress>
          <div class="filter-tip">
            <el-icon><InfoFilled /></el-icon>
            <span v-if="device.filterLife < 20">滤芯寿命偏低，建议尽快更换</span>
            <span v-else-if="device.filterLife < 50">滤芯寿命中等，请关注</span>
            <span v-else>滤芯状态良好</span>
          </div>
        </div>
      </el-col>

      <!-- 用水量曲线 -->
      <el-col :xs="24" :md="16" :lg="18">
        <ChartCard title="近24小时用水量曲线" :option="chartOption" height="320px" />
      </el-col>
    </el-row>

    <!-- 远程控制面板 -->
    <div class="app-card control-panel">
      <div class="card-title">
        <el-icon><Setting /></el-icon>
        <span>远程控制面板</span>
      </div>
      <div class="control-grid">
        <!-- 开关机 -->
        <div class="control-item">
          <div class="ctrl-icon" :class="{ active: device.power }">
            <el-icon :size="26"><SwitchButton /></el-icon>
          </div>
          <div class="ctrl-info">
            <div class="ctrl-label">设备开关机</div>
            <div class="ctrl-desc">当前状态：{{ device.power ? '运行中' : '已关机' }}</div>
          </div>
          <el-switch
            v-model="device.power"
            active-text="开"
            inactive-text="关"
            inline-prompt
            style="--el-switch-on-color: #52c41a"
            @change="onPowerChange"
          />
        </div>

        <!-- 冲洗 -->
        <div class="control-item">
          <div class="ctrl-icon" :class="{ active: device.flushing }">
            <el-icon :size="26"><Refresh /></el-icon>
          </div>
          <div class="ctrl-info">
            <div class="ctrl-label">滤芯冲洗</div>
            <div class="ctrl-desc">{{ device.flushing ? '冲洗进行中...' : '清洁滤芯延长寿命' }}</div>
          </div>
          <el-button
            type="primary"
            :loading="device.flushing"
            :disabled="device.flushing"
            @click="handleFlush"
          >
            {{ device.flushing ? '冲洗中' : '开始冲洗' }}
          </el-button>
        </div>

        <!-- 复位滤芯 -->
        <div class="control-item">
          <div class="ctrl-icon">
            <el-icon :size="26"><RefreshLeft /></el-icon>
          </div>
          <div class="ctrl-info">
            <div class="ctrl-label">复位滤芯</div>
            <div class="ctrl-desc">更换滤芯后复位寿命计数</div>
          </div>
          <el-button type="warning" plain @click="handleResetFilter">复位</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 头部 */
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.dev-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(58, 142, 246, 0.3);
}
.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-title .sn {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}
.header-meta {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c0c4cc;
  margin-right: 4px;
  vertical-align: middle;
}
.dot.on {
  background: #52c41a;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.18);
}

/* 实时状态迷你卡片 */
.status-row {
  margin-bottom: 16px;
}
.status-row .el-col {
  margin-bottom: 16px;
}
.mini-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}
.mini-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.mini-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}
.mini-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.mini-value .unit {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
}
.quality-tag {
  margin-left: 4px;
}

/* 滤芯寿命卡 */
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle-num {
  font-size: 30px;
  font-weight: 700;
}
.circle-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.filter-tip {
  margin-top: 18px;
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 远程控制面板 */
.control-panel {
  margin-top: 16px;
}
.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.control-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f7fbff, #f0f9fb);
  border: 1px solid #eaf2fb;
}
.ctrl-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8eef5;
  color: #909399;
  flex-shrink: 0;
  transition: all 0.3s;
}
.ctrl-icon.active {
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  color: #fff;
  box-shadow: 0 4px 12px rgba(58, 142, 246, 0.3);
}
.ctrl-info {
  flex: 1;
  min-width: 0;
}
.ctrl-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.ctrl-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
