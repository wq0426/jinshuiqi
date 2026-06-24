<script setup>
// 设备列表页面
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDevices } from '@/api'
import StatCard from '@/components/StatCard.vue'

const router = useRouter()

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getDevices()
})

// 顶部统计（基于设备数组计算）
const total = computed(() => list.value.length)
const onlineCount = computed(() => list.value.filter((d) => d.online).length)
const offlineCount = computed(() => list.value.filter((d) => !d.online).length)
const filterWarnCount = computed(() => list.value.filter((d) => d.filterLife < 20).length)

// 型号下拉（去重）
const modelOptions = computed(() => [...new Set(list.value.map((d) => d.model))])

// 筛选条件
const filters = reactive({ keyword: '', model: '', online: '' })
const query = reactive({ keyword: '', model: '', online: '' })

// 分页
const page = ref(1)
const size = ref(8)

// 过滤后的数据
const filtered = computed(() => {
  return list.value.filter((d) => {
    if (query.keyword) {
      const kw = query.keyword.trim()
      if (!d.sn.includes(kw) && !d.customer.includes(kw)) return false
    }
    if (query.model && d.model !== query.model) return false
    if (query.online !== '' && d.online !== query.online) return false
    return true
  })
})

// 当前页数据（本地切片）
const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

// 查询 / 重置
function handleSearch() {
  query.keyword = filters.keyword
  query.model = filters.model
  query.online = filters.online
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.model = ''
  filters.online = ''
  handleSearch()
}

// 滤芯寿命进度条颜色
function lifeColor(val) {
  if (val > 50) return '#52c41a'
  if (val >= 20) return '#faad14'
  return '#ff4d4f'
}

// 跳转详情
function goDetail(row) {
  router.push('/device/detail/' + row.id)
}

// 远程控制（列表内快捷开关机）
function togglePower(row) {
  row.power = !row.power
  ElMessage.success(`「${row.sn}」已${row.power ? '开机' : '关机'}`)
}
</script>

<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6">
        <StatCard label="设备总数" :value="total" icon="Cpu" suffix=" 台" />
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <StatCard
          label="在线设备"
          :value="onlineCount"
          icon="CircleCheck"
          suffix=" 台"
          gradient="linear-gradient(135deg,#52c41a,#26C6DA)"
        />
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <StatCard
          label="离线设备"
          :value="offlineCount"
          icon="CircleClose"
          suffix=" 台"
          gradient="linear-gradient(135deg,#909399,#c0c4cc)"
        />
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <StatCard
          label="滤芯预警数"
          :value="filterWarnCount"
          icon="Warning"
          suffix=" 台"
          gradient="linear-gradient(135deg,#ff4d4f,#faad14)"
        />
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            placeholder="设备编号 / 客户"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select v-model="filters.model" placeholder="全部型号" clearable style="width: 160px">
            <el-option v-for="m in modelOptions" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="filters.online" placeholder="全部" clearable style="width: 120px">
            <el-option label="在线" :value="true" />
            <el-option label="离线" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设备表格 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column prop="sn" label="设备编号" width="150" />
        <el-table-column prop="model" label="型号" width="140" />
        <el-table-column label="绑定客户" min-width="160">
          <template #default="{ row }">
            <div class="cust-cell">
              <span class="cust-name">{{ row.customer }}</span>
              <span class="cust-phone">{{ row.phone }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="所在区域" min-width="150" />
        <el-table-column label="在线状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.online ? 'success' : 'info'" effect="light" round>
              <span class="dot" :class="{ on: row.online }"></span>
              {{ row.online ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="滤芯寿命" width="180">
          <template #default="{ row }">
            <el-progress
              :percentage="row.filterLife"
              :color="lifeColor(row.filterLife)"
              :stroke-width="10"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastReport" label="最近上报时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="goDetail(row)">
              <el-icon><View /></el-icon>详情
            </el-button>
            <el-button :type="row.power ? 'warning' : 'success'" link @click="togglePower(row)">
              <el-icon><SwitchButton /></el-icon>{{ row.power ? '关机' : '开机' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          :page-size="size"
          :total="filtered.length"
          layout="total, prev, pager, next, jumper"
          background
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  margin-bottom: 16px;
}
.stat-row .el-col {
  margin-bottom: 16px;
}
.cust-cell {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}
.cust-name {
  color: #303133;
  font-weight: 500;
}
.cust-phone {
  color: #909399;
  font-size: 12px;
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
</style>
