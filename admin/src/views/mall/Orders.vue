<script setup>
// 订单管理页面
import { ref, computed, reactive, onMounted } from 'vue'
import { getOrders } from '@/api'
import { orderStatusType } from '@/constants'

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getOrders()
})

const statusOptions = ['待付款', '待发货', '待收货', '已完成', '已取消', '退款中']

// 筛选
const filters = reactive({ keyword: '', status: '', dateRange: [] })
const query = reactive({ keyword: '', status: '', dateRange: [] })

// 分页
const page = ref(1)
const size = ref(8)

const filtered = computed(() => {
  return list.value.filter((o) => {
    if (query.keyword) {
      const kw = query.keyword
      if (!o.id.includes(kw) && !o.customer.includes(kw)) return false
    }
    if (query.status && o.status !== query.status) return false
    if (query.dateRange && query.dateRange.length === 2) {
      const day = o.createTime.slice(0, 10)
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
  query.status = filters.status
  query.dateRange = filters.dateRange ? [...filters.dateRange] : []
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.status = ''
  filters.dateRange = []
  handleSearch()
}

// 商品摘要
function itemSummary(items) {
  if (!items || !items.length) return '-'
  const total = items.reduce((s, it) => s + it.qty, 0)
  return items.length > 1 || total > 1 ? `${items[0].name} 等${total}件` : items[0].name
}

// 订单详情抽屉
const drawerVisible = ref(false)
const current = ref(null)
function openDetail(row) {
  current.value = row
  drawerVisible.value = true
}
</script>

<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="订单号 / 客户" clearable style="width: 200px" @keyup.enter="handleSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
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

    <!-- 订单表格 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column prop="id" label="订单号" width="160" />
        <el-table-column label="客户" width="150">
          <template #default="{ row }">
            <div class="cust">
              <div class="cust-name">{{ row.customer }}</div>
              <div class="cust-phone">{{ row.phone }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品" min-width="220">
          <template #default="{ row }">{{ itemSummary(row.items) }}</template>
        </el-table-column>
        <el-table-column label="实付金额" width="120">
          <template #default="{ row }">
            <span class="amount">¥{{ row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="120" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="orderStatusType[row.status]" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)"><el-icon><View /></el-icon>详情</el-button>
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

    <!-- 订单详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="订单详情" size="520px">
      <div v-if="current" class="detail">
        <!-- 状态头 -->
        <div class="detail-head">
          <div>
            <div class="od-id">订单号：{{ current.id }}</div>
            <div class="od-time">下单时间：{{ current.createTime }}</div>
          </div>
          <el-tag :type="orderStatusType[current.status]" effect="dark" size="large">{{ current.status }}</el-tag>
        </div>

        <!-- 收货信息 -->
        <div class="block">
          <div class="block-title"><el-icon><LocationFilled /></el-icon>收货信息</div>
          <div class="info-row"><span class="lbl">收货人</span>{{ current.customer }}</div>
          <div class="info-row"><span class="lbl">联系电话</span>{{ current.phone }}</div>
          <div class="info-row"><span class="lbl">收货地址</span>{{ current.address }}</div>
        </div>

        <!-- 商品明细 -->
        <div class="block">
          <div class="block-title"><el-icon><Goods /></el-icon>商品明细</div>
          <div v-for="(it, i) in current.items" :key="i" class="goods-row">
            <div class="g-img" :style="{ background: it.image }"><el-icon><Goods /></el-icon></div>
            <div class="g-main">
              <div class="g-name">{{ it.name }}</div>
              <div class="g-price">¥{{ it.price }} × {{ it.qty }}</div>
            </div>
            <div class="g-sub">¥{{ it.subtotal }}</div>
          </div>
        </div>

        <!-- 金额合计 -->
        <div class="block amount-block">
          <div class="amt-row"><span>商品总额</span><span>¥{{ current.amount }}</span></div>
          <div class="amt-row total"><span>实付金额</span><span class="amount">¥{{ current.payAmount }}</span></div>
        </div>

        <!-- 支付信息 -->
        <div class="block">
          <div class="block-title"><el-icon><Wallet /></el-icon>支付信息</div>
          <div class="info-row"><span class="lbl">支付方式</span>{{ current.payType }}</div>
          <div class="info-row"><span class="lbl">订单状态</span>{{ current.status }}</div>
        </div>

        <!-- 物流时间线 -->
        <div class="block">
          <div class="block-title"><el-icon><Van /></el-icon>物流轨迹</div>
          <el-timeline>
            <el-timeline-item
              v-for="(lg, i) in current.logistics"
              :key="i"
              :timestamp="lg.time"
              :type="i === 0 ? 'primary' : ''"
              placement="top"
            >
              {{ lg.desc }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.cust-name {
  color: #303133;
  font-weight: 500;
}
.cust-phone {
  color: #909399;
  font-size: 12px;
}
.amount {
  color: #ff4d4f;
  font-weight: 600;
}

/* 抽屉详情 */
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  margin-bottom: 16px;
}
.od-id {
  font-size: 15px;
  font-weight: 600;
}
.od-time {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}
.block {
  background: #fff;
  border: 1px solid #f0f2f5;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.block-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  font-size: 14px;
}
.block-title .el-icon {
  color: #3a8ef6;
}
.info-row {
  font-size: 13px;
  color: #606266;
  line-height: 26px;
}
.info-row .lbl {
  display: inline-block;
  width: 72px;
  color: #909399;
}
.goods-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #f0f2f5;
}
.goods-row:last-child {
  border-bottom: none;
}
.g-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}
.g-main {
  flex: 1;
  min-width: 0;
}
.g-name {
  font-size: 13px;
  color: #303133;
}
.g-price {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.g-sub {
  font-weight: 600;
  color: #303133;
}
.amount-block .amt-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #606266;
  line-height: 28px;
}
.amount-block .total {
  font-size: 15px;
  font-weight: 600;
  border-top: 1px dashed #f0f2f5;
  margin-top: 6px;
  padding-top: 8px;
}
</style>
