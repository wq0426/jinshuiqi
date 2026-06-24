<script setup>
// 预警列表
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAlerts, handleAlert as handleAlertApi } from '@/api'
import { alertTypeColor, alertLevelColor } from '@/constants'

const list = ref([])
onMounted(async () => {
  list.value = await getAlerts()
})
const filters = reactive({ type: '', level: '', status: '' })
const query = reactive({ type: '', level: '', status: '' })
const page = ref(1)
const size = ref(10)

const typeOptions = ['滤芯到期', '设备离线', '水质异常', '工单超时', '库存不足']
const levelOptions = ['高', '中', '低']

const filtered = computed(() =>
  list.value.filter((a) => {
    if (query.type && a.type !== query.type) return false
    if (query.level && a.level !== query.level) return false
    if (query.status && a.status !== query.status) return false
    return true
  })
)
const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

// 顶部分类统计
const summary = computed(() =>
  typeOptions.map((t) => ({
    type: t,
    count: list.value.filter((a) => a.type === t && a.status === '待处理').length
  }))
)
const pendingTotal = computed(() => list.value.filter((a) => a.status === '待处理').length)

function handleSearch() {
  Object.assign(query, filters)
  page.value = 1
}
function handleReset() {
  Object.assign(filters, { type: '', level: '', status: '' })
  handleSearch()
}
function handle(row) {
  ElMessageBox.confirm(`确认处理预警「${row.desc}」？`, '处理预警', { type: 'warning' })
    .then(async () => {
      await handleAlertApi(row.id)
      row.status = '已处理'
      ElMessage.success('预警已标记为已处理')
    })
    .catch(() => {})
}
function quickFilter(type) {
  filters.type = type
  filters.status = '待处理'
  handleSearch()
}
</script>

<template>
  <div class="page-container">
    <!-- 分类统计卡 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="8" :lg="4">
        <div class="sum-card total" @click="handleReset">
          <div class="t">待处理总数</div>
          <div class="v">{{ pendingTotal }}</div>
        </div>
      </el-col>
      <el-col v-for="s in summary" :key="s.type" :xs="12" :sm="8" :lg="4">
        <div class="sum-card" @click="quickFilter(s.type)">
          <div class="t">{{ s.type }}</div>
          <div class="v" :class="{ danger: s.count > 0 }">{{ s.count }}</div>
        </div>
      </el-col>
    </el-row>

    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="预警类型">
          <el-select v-model="filters.type" placeholder="全部" clearable style="width:140px">
            <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="filters.level" placeholder="全部" clearable style="width:110px">
            <el-option v-for="l in levelOptions" :key="l" :label="l" :value="l" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width:120px">
            <el-option label="待处理" value="待处理" />
            <el-option label="已处理" value="已处理" />
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
        <el-table-column prop="id" label="预警编号" width="120" />
        <el-table-column label="类型" width="110">
          <template #default="{ row }"><el-tag :type="alertTypeColor[row.type]" effect="light">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column label="等级" width="90">
          <template #default="{ row }"><el-tag :type="alertLevelColor[row.level]" effect="dark">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="target" label="预警对象" width="180" />
        <el-table-column prop="customer" label="关联客户" width="100" />
        <el-table-column prop="desc" label="预警内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="time" label="预警时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '待处理' ? 'danger' : 'success'" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待处理'" type="primary" link @click="handle(row)">处理</el-button>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="page" :page-size="size" :total="filtered.length" layout="total, prev, pager, next, jumper" background />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sum-card { background: #fff; border-radius: 10px; padding: 16px 18px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04); cursor: pointer; transition: transform 0.2s; }
.sum-card:hover { transform: translateY(-3px); }
.sum-card.total { background: linear-gradient(135deg, #3a8ef6, #26c6da); color: #fff; }
.sum-card .t { font-size: 13px; opacity: 0.85; margin-bottom: 8px; }
.sum-card .v { font-size: 26px; font-weight: 700; }
.sum-card .v.danger { color: #ff4d4f; }
.sum-card.total .v { color: #fff; }
.muted { color: #c0c4cc; }
</style>
