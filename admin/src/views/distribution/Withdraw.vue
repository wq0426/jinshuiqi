<script setup>
// 提现审核
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getWithdrawals, auditWithdrawal } from '@/api'
import { withdrawStatusColor } from '@/constants'

const list = ref([])
onMounted(async () => {
  list.value = await getWithdrawals()
})

const filters = reactive({ keyword: '', status: '' })
const query = reactive({ keyword: '', status: '' })
const page = ref(1)
const size = ref(8)

const statusOptions = ['待审核', '已通过', '已驳回']

const filtered = computed(() =>
  list.value.filter((w) => {
    if (query.keyword && !w.distributor.includes(query.keyword) && !w.phone.includes(query.keyword)) return false
    if (query.status && w.status !== query.status) return false
    return true
  })
)
const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

// 顶部统计
const stat = computed(() => {
  const pending = list.value.filter((w) => w.status === '待审核')
  return {
    pendingCount: pending.length,
    pendingAmount: pending.reduce((s, w) => s + w.amount, 0).toFixed(2),
    passAmount: list.value.filter((w) => w.status === '已通过').reduce((s, w) => s + w.amount, 0).toFixed(2)
  }
})

function handleSearch() {
  query.keyword = filters.keyword
  query.status = filters.status
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.status = ''
  handleSearch()
}

function approve(row) {
  ElMessageBox.confirm(`确认通过「${row.distributor}」的 ¥${row.amount} 提现申请？`, '提现审核', { type: 'success' })
    .then(async () => {
      await auditWithdrawal(row.id, '已通过')
      row.status = '已通过'
      ElMessage.success('已通过，款项将打款至' + row.account)
    })
    .catch(() => {})
}
function reject(row) {
  ElMessageBox.prompt('请输入驳回原因', '驳回提现', { inputPlaceholder: '如：账户信息有误' })
    .then(async ({ value }) => {
      await auditWithdrawal(row.id, '已驳回', value)
      row.status = '已驳回'
      row.remark = value
      ElMessage.warning('已驳回该提现申请')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="8">
        <div class="stat-card warn">
          <div class="t">待审核提现</div>
          <div class="v">{{ stat.pendingCount }}<span class="u"> 笔</span></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="t">待审核金额</div>
          <div class="v">¥{{ stat.pendingAmount }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <div class="stat-card ok">
          <div class="t">累计已打款</div>
          <div class="v">¥{{ stat.passAmount }}</div>
        </div>
      </el-col>
    </el-row>

    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="分销员">
          <el-input v-model="filters.keyword" placeholder="姓名 / 手机号" clearable style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 140px">
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
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column prop="id" label="提现单号" width="130" />
        <el-table-column prop="distributor" label="分销员" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column label="提现金额" width="130">
          <template #default="{ row }"><span class="amount">¥{{ row.amount }}</span></template>
        </el-table-column>
        <el-table-column label="收款账户" min-width="180">
          <template #default="{ row }">{{ row.account }}　{{ row.accountNo }}</template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><el-tag :type="withdrawStatusColor[row.status]" effect="light">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === '待审核'">
              <el-button type="success" link @click="approve(row)">通过</el-button>
              <el-button type="danger" link @click="reject(row)">驳回</el-button>
            </template>
            <span v-else class="muted">已处理</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="page" :page-size="size" :total="filtered.length" layout="total, prev, pager, next" background />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px 22px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border-left: 4px solid #3a8ef6;
}
.stat-card.warn { border-left-color: #faad14; }
.stat-card.ok { border-left-color: #52c41a; }
.stat-card .t { color: #909399; font-size: 13px; margin-bottom: 10px; }
.stat-card .v { font-size: 28px; font-weight: 700; color: #303133; }
.stat-card .u { font-size: 14px; color: #909399; font-weight: 400; }
.amount { color: #ff4d4f; font-weight: 600; }
.muted { color: #c0c4cc; }
</style>
