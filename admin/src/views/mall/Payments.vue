<script setup>
// 商城-支付管理（支付流水）
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPaymentRecords, refundPayment, exportCsv } from '@/api'

const list = ref([])
async function load() { list.value = await getPaymentRecords() }
onMounted(load)

const channelMap = { wxpay: '微信支付', alipay: '支付宝', balance: '余额支付' }
const typeMap = { order: { t: 'primary', l: '订单' }, recharge: { t: 'success', l: '充值' }, refund: { t: 'info', l: '退款' } }
const statusMap = { success: { t: 'success', l: '成功' }, refund: { t: 'warning', l: '已退款' }, fail: { t: 'danger', l: '失败' } }
const filters = reactive({ keyword: '', channel: '', status: '' })
const filtered = computed(() => list.value.filter((r) => {
  if (filters.keyword && !r.orderId.includes(filters.keyword) && !r.customer.includes(filters.keyword)) return false
  if (filters.channel && r.channel !== filters.channel) return false
  if (filters.status && r.status !== filters.status) return false
  return true
}))
const total = computed(() => filtered.value.filter((r) => r.status === 'success').reduce((s, r) => s + r.amount, 0))

async function refund(row) {
  await ElMessageBox.confirm(`确认对流水「${row.id}」发起退款 ¥${row.amount}？`, '退款', { type: 'warning' })
  await refundPayment(row.id); ElMessage.success('已退款'); load()
}
function doExport() {
  exportCsv('支付流水', [
    { prop: 'id', label: '流水号' }, { prop: 'orderId', label: '关联单号' },
    { prop: 'customer', label: '客户' }, { prop: 'channel', label: '渠道' },
    { prop: 'amount', label: '金额' }, { prop: 'type', label: '类型' },
    { prop: 'status', label: '状态' }, { prop: 'time', label: '时间' }
  ], filtered.value)
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词"><el-input v-model="filters.keyword" placeholder="单号 / 客户" clearable style="width:180px" /></el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="filters.channel" placeholder="全部" clearable style="width:140px">
            <el-option v-for="(v, k) in channelMap" :key="k" :label="v" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width:120px">
            <el-option v-for="(v, k) in statusMap" :key="k" :label="v.l" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="doExport">导出 CSV</el-button>
          <el-tag type="success" effect="light" style="margin-left:10px">成功收款 ¥{{ total.toLocaleString() }}</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-card">
      <el-table :data="filtered" stripe style="width:100%">
        <el-table-column prop="id" label="流水号" width="160" />
        <el-table-column prop="orderId" label="关联单号" width="160" />
        <el-table-column prop="customer" label="客户" width="100" />
        <el-table-column label="渠道" width="110">
          <template #default="{ row }">{{ channelMap[row.channel] }}</template>
        </el-table-column>
        <el-table-column label="金额" width="110">
          <template #default="{ row }"><span class="amount">¥{{ row.amount }}</span></template>
        </el-table-column>
        <el-table-column label="类型" width="90">
          <template #default="{ row }"><el-tag :type="typeMap[row.type].t" effect="light">{{ typeMap[row.type].l }}</el-tag></template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><el-tag :type="statusMap[row.status].t" effect="light">{{ statusMap[row.status].l }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" label="时间" min-width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'success' && row.type !== 'refund'" link type="danger" @click="refund(row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.amount { color: #ff4d4f; font-weight: 600; }
</style>
