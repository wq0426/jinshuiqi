<script setup>
// 佣金记录
import { ref, reactive, computed, onMounted } from 'vue'
import { getCommissions } from '@/api'
import { commissionStatusColor } from '@/constants'

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getCommissions()
})

const typeOptions = ['直推佣金', '间推佣金', '平级奖', '团队管理奖']
const statusOptions = ['已结算', '待结算', '已冻结']
const typeColor = { 直推佣金: 'primary', 间推佣金: 'success', 平级奖: 'warning', 团队管理奖: 'info' }

// 筛选
const filters = reactive({ keyword: '', type: '', status: '', dateRange: [] })
const query = reactive({ keyword: '', type: '', status: '', dateRange: [] })

// 分页
const page = ref(1)
const size = ref(8)

const filtered = computed(() =>
  list.value.filter((c) => {
    if (query.keyword) {
      const kw = query.keyword
      if (!c.distributor.includes(kw) && !c.orderId.includes(kw)) return false
    }
    if (query.type && c.type !== query.type) return false
    if (query.status && c.status !== query.status) return false
    if (query.dateRange && query.dateRange.length === 2) {
      const day = c.time.slice(0, 10)
      if (day < query.dateRange[0] || day > query.dateRange[1]) return false
    }
    return true
  })
)

const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

// 合计金额
const totalAmount = computed(() => filtered.value.reduce((s, c) => s + c.amount, 0).toFixed(2))

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
</script>

<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="分销员 / 订单号" clearable style="width: 200px" @keyup.enter="handleSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="佣金类型">
          <el-select v-model="filters.type" placeholder="全部类型" clearable style="width: 150px">
            <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 130px">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
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

    <!-- 合计提示 -->
    <div class="summary-tip">
      共 <b>{{ filtered.length }}</b> 条佣金记录，合计金额
      <span class="amount">¥{{ totalAmount }}</span>
    </div>

    <!-- 列表 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column prop="id" label="记录号" width="130" />
        <el-table-column prop="distributor" label="分销员" width="110" />
        <el-table-column label="佣金类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeColor[row.type]" effect="light">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="关联订单" width="160" />
        <el-table-column prop="rate" label="比例" width="90" align="center" />
        <el-table-column label="金额" width="120" align="right">
          <template #default="{ row }"><span class="amount">¥{{ row.amount }}</span></template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="commissionStatusColor[row.status]" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" min-width="150" />
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
.summary-tip {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
  padding-left: 4px;
  b {
    color: #3a8ef6;
  }
}
.amount {
  color: #ff4d4f;
  font-weight: 600;
}
</style>
