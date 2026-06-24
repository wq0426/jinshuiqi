<script setup>
// 师傅管理
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatCard from '@/components/StatCard.vue'
import {
  getTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  setTechnicianOnline
} from '@/api'

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getTechnicians()
})

const levels = ['金牌师傅', '银牌师傅', '认证师傅']
const levelColor = { 金牌师傅: 'warning', 银牌师傅: 'info', 认证师傅: 'success' }

// 顶部统计
const stats = computed(() => {
  const total = list.value.length
  const online = list.value.filter((t) => t.online).length
  const ongoing = list.value.reduce((s, t) => s + t.ongoing, 0)
  const avg = total ? (list.value.reduce((s, t) => s + t.rating, 0) / total).toFixed(1) : 0
  return { total, online, ongoing, avg }
})

// 筛选
const filters = reactive({ keyword: '', online: '' })
const query = reactive({ keyword: '', online: '' })

// 分页
const page = ref(1)
const size = ref(8)

const filtered = computed(() => {
  return list.value.filter((t) => {
    if (query.keyword) {
      const kw = query.keyword
      if (!t.name.includes(kw) && !t.phone.includes(kw)) return false
    }
    if (query.online !== '' && t.online !== query.online) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

function handleSearch() {
  query.keyword = filters.keyword
  query.online = filters.online
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.online = ''
  handleSearch()
}

// 接单状态切换
async function toggleOnline(row) {
  await setTechnicianOnline(row.id, row.online)
  ElMessage.success(`${row.name} 已${row.online ? '上线' : '下线'}`)
}

// 新增 / 编辑弹窗
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({ id: '', name: '', phone: '', area: '', level: '认证师傅', online: true })

function openAdd() {
  isEdit.value = false
  Object.assign(form, { id: '', name: '', phone: '', area: '', level: '认证师傅', online: true })
  dialogVisible.value = true
}
function openEdit(row) {
  isEdit.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}
async function saveForm() {
  if (!form.name || !form.phone) {
    ElMessage.warning('请填写姓名和电话')
    return
  }
  const payload = { name: form.name, phone: form.phone, area: form.area, level: form.level, online: form.online }
  if (isEdit.value) {
    const updated = await updateTechnician(form.id, payload)
    const idx = list.value.findIndex((t) => t.id === form.id)
    if (idx > -1) list.value[idx] = updated
    ElMessage.success('已更新师傅信息')
  } else {
    const created = await createTechnician(payload)
    list.value.unshift(created)
    ElMessage.success('已新增师傅')
    page.value = 1
  }
  dialogVisible.value = false
}

function removeTech(row) {
  ElMessageBox.confirm(`确定删除师傅「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
    .then(async () => {
      await deleteTechnician(row.id)
      list.value = list.value.filter((t) => t.id !== row.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6"><StatCard label="师傅总数" :value="stats.total" icon="Avatar" suffix=" 人" /></el-col>
      <el-col :span="6"><StatCard label="接单中" :value="stats.online" icon="CircleCheck" suffix=" 人" gradient="linear-gradient(135deg,#52c41a,#95de64)" /></el-col>
      <el-col :span="6"><StatCard label="在途工单" :value="stats.ongoing" icon="Van" suffix=" 单" gradient="linear-gradient(135deg,#faad14,#ffc53d)" /></el-col>
      <el-col :span="6"><StatCard label="平均评分" :value="stats.avg" icon="Star" gradient="linear-gradient(135deg,#3A8EF6,#26C6DA)" /></el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="姓名 / 电话" clearable style="width: 200px" @keyup.enter="handleSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="接单状态">
          <el-select v-model="filters.online" placeholder="全部" clearable style="width: 130px">
            <el-option label="接单中" :value="true" />
            <el-option label="已下线" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="openAdd"><el-icon><Plus /></el-icon>新增师傅</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 师傅表格 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="area" label="服务区域" min-width="160" show-overflow-tooltip />
        <el-table-column label="接单状态" width="110">
          <template #default="{ row }">
            <el-switch v-model="row.online" @change="toggleOnline(row)" />
          </template>
        </el-table-column>
        <el-table-column label="评分" width="160">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled show-score score-template="{value}" />
          </template>
        </el-table-column>
        <el-table-column label="在途工单" width="100">
          <template #default="{ row }">
            <el-tag :type="row.ongoing > 0 ? 'warning' : 'info'" effect="plain">{{ row.ongoing }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalOrders" label="累计接单" width="100" />
        <el-table-column label="等级" width="110">
          <template #default="{ row }">
            <el-tag :type="levelColor[row.level]" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button type="danger" link @click="removeTech(row)"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑师傅' : '新增师傅'" width="480px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="服务区域">
          <el-input v-model="form.area" placeholder="如：西湖区、拱墅区" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="form.level" style="width: 100%">
            <el-option v-for="l in levels" :key="l" :label="l" :value="l" />
          </el-select>
        </el-form-item>
        <el-form-item label="接单状态">
          <el-switch v-model="form.online" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.stat-row {
  margin-bottom: 16px;
}
</style>
