<script setup>
// 工单列表页面
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getWorkorders } from '@/api'
import {
  workorderTypeColor,
  workorderStatusColor,
  workorderTypes,
  workorderStatuses
} from '@/constants'

const router = useRouter()

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getWorkorders()
})

// 顶部状态统计
const statusSummary = computed(() =>
  workorderStatuses.map((s) => ({
    status: s,
    count: list.value.filter((w) => w.status === s).length,
    type: workorderStatusColor[s]
  }))
)

// 筛选条件
const filters = reactive({ keyword: '', type: '', status: '', dateRange: [] })
const query = reactive({ keyword: '', type: '', status: '', dateRange: [] })

// 分页
const page = ref(1)
const size = ref(8)

const filtered = computed(() => {
  return list.value.filter((w) => {
    if (query.keyword) {
      const kw = query.keyword
      if (!w.id.includes(kw) && !w.customer.includes(kw)) return false
    }
    if (query.type && w.type !== query.type) return false
    if (query.status && w.status !== query.status) return false
    if (query.dateRange && query.dateRange.length === 2) {
      const day = w.createTime.slice(0, 10)
      if (day < query.dateRange[0] || day > query.dateRange[1]) return false
    }
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

function handleSearch() {
  query.keyword = filters.keyword
  query.type = filters.type
  query.status = filters.status
  query.dateRange = filters.dateRange ? [...filters.dateRange] : []
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.type = ''
  filters.status = ''
  filters.dateRange = []
  handleSearch()
}

// 跳转详情
function openDetail(row) {
  router.push('/workorder/detail/' + row.id)
}
// 派单
function dispatch(row) {
  ElMessage.info(`请前往派单中心为工单 ${row.id} 指派师傅`)
  router.push('/workorder/dispatch')
}
</script>

<template>
  <div class="page-container">
    <!-- 状态统计 -->
    <div class="summary-bar">
      <div v-for="s in statusSummary" :key="s.status" class="summary-item">
        <el-tag :type="s.type" effect="plain" size="large">{{ s.status }}</el-tag>
        <span class="summary-count">{{ s.count }}</span>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="工单号 / 客户" clearable style="width: 200px" @keyup.enter="handleSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="filters.type" placeholder="全部类型" clearable style="width: 130px">
            <el-option v-for="t in workorderTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 130px">
            <el-option v-for="s in workorderStatuses" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工单表格 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column prop="id" label="工单号" width="155" />
        <el-table-column label="类型" width="90">
          <template #default="{ row }">
            <el-tag :type="workorderTypeColor[row.type]" effect="light">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="客户" width="140">
          <template #default="{ row }">
            <div class="cust-name">{{ row.customer }}</div>
            <div class="cust-phone">{{ row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务地址" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">{{ row.address }}</template>
        </el-table-column>
        <el-table-column prop="deviceModel" label="设备型号" width="130" />
        <el-table-column label="师傅" width="110">
          <template #default="{ row }">
            <span v-if="row.technician">{{ row.technician }}</span>
            <el-tag v-else type="info" effect="plain" size="small">未派单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="workorderStatusColor[row.status]" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)"><el-icon><View /></el-icon>详情</el-button>
            <el-button v-if="row.status === '已下单'" type="warning" link @click="dispatch(row)"><el-icon><Promotion /></el-icon>派单</el-button>
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
  </div>
</template>

<style scoped>
.summary-bar {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.summary-item {
  flex: 1;
  min-width: 150px;
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.summary-count {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}
.cust-name {
  color: #303133;
  font-weight: 500;
}
.cust-phone {
  color: #909399;
  font-size: 12px;
}
</style>
