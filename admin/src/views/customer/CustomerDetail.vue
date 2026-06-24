<script setup>
// 客户详情页面
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCustomer } from '@/api'
import { customerLevelColor } from '@/constants'

const route = useRoute()
const router = useRouter()

// 客户详情（接口拉取），先用空默认占位
const customer = ref({
  id: '', name: '', nickname: '', phone: '', area: '', balance: 0, points: 0,
  level: '', deviceCount: 0, orderCount: 0, registerDate: '', lastActive: '',
  devices: [], orders: [], workorders: []
})
onMounted(async () => {
  customer.value = await getCustomer(route.params.id)
})

const activeTab = ref('base')

// 小指标
const metrics = computed(() => [
  { label: '账户余额', value: '¥' + Number(customer.value.balance).toFixed(2), color: '#ff4d4f' },
  { label: '可用积分', value: customer.value.points, color: '#faad14' },
  { label: '绑定设备', value: customer.value.deviceCount, color: '#3A8EF6' },
  { label: '历史订单', value: customer.value.orderCount, color: '#52c41a' }
])

const orderStatusColor = { 已完成: 'success', 待发货: 'warning', 待收货: 'primary' }
const woStatusColor = { 已完成: 'success', 服务中: 'warning' }

function goBack() {
  router.back()
}
</script>

<template>
  <div class="page-container">
    <div class="back-bar">
      <el-button @click="goBack"><el-icon><Back /></el-icon>返回</el-button>
    </div>

    <!-- 客户概览卡片 -->
    <div class="profile-card">
      <div class="profile-left">
        <el-avatar :size="72" class="profile-avatar">{{ customer.name.charAt(0) }}</el-avatar>
        <div class="profile-meta">
          <div class="profile-name">
            {{ customer.nickname }}
            <el-tag :type="customerLevelColor[customer.level]" effect="dark" size="small">
              {{ customer.level }}
            </el-tag>
          </div>
          <div class="profile-sub">
            <span><el-icon><User /></el-icon>{{ customer.name }}</span>
            <span><el-icon><Phone /></el-icon>{{ customer.phone }}</span>
            <span><el-icon><LocationInformation /></el-icon>{{ customer.area }}</span>
          </div>
        </div>
      </div>
      <div class="profile-metrics">
        <div v-for="m in metrics" :key="m.label" class="metric-item">
          <div class="metric-value" :style="{ color: m.color }">{{ m.value }}</div>
          <div class="metric-label">{{ m.label }}</div>
        </div>
      </div>
    </div>

    <!-- 详情 Tabs -->
    <div class="app-card detail-card">
      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="base">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户编号">{{ customer.id }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ customer.name }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ customer.nickname }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ customer.phone }}</el-descriptions-item>
            <el-descriptions-item label="所属区域">{{ customer.area }}</el-descriptions-item>
            <el-descriptions-item label="分销等级">
              <el-tag :type="customerLevelColor[customer.level]" effect="light">{{ customer.level }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="账户余额">¥{{ customer.balance.toFixed(2) }}</el-descriptions-item>
            <el-descriptions-item label="可用积分">{{ customer.points }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ customer.registerDate }}</el-descriptions-item>
            <el-descriptions-item label="最近活跃">{{ customer.lastActive }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 绑定设备 -->
        <el-tab-pane label="绑定设备" name="device">
          <el-table :data="customer.devices" stripe style="width: 100%">
            <el-table-column prop="sn" label="设备 SN" min-width="160" />
            <el-table-column prop="model" label="型号" width="140" />
            <el-table-column label="在线状态" width="120">
              <template #default="{ row }">
                <el-tag :type="row.online ? 'success' : 'info'" effect="light">
                  {{ row.online ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="滤芯寿命" min-width="220">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.filterLife"
                  :status="row.filterLife < 20 ? 'exception' : row.filterLife < 50 ? 'warning' : 'success'"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 订单记录 -->
        <el-tab-pane label="订单记录" name="order">
          <el-table :data="customer.orders" stripe style="width: 100%">
            <el-table-column prop="id" label="订单号" min-width="170" />
            <el-table-column prop="goods" label="商品" min-width="180" />
            <el-table-column label="金额" width="120">
              <template #default="{ row }">
                <span class="money">¥{{ row.amount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="orderStatusColor[row.status] || 'info'" effect="light">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="下单时间" width="160" />
          </el-table>
        </el-tab-pane>

        <!-- 服务工单 -->
        <el-tab-pane label="服务工单" name="wo">
          <el-table :data="customer.workorders" stripe style="width: 100%">
            <el-table-column prop="id" label="工单号" min-width="170" />
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                <el-tag effect="plain">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="woStatusColor[row.status] || 'info'" effect="light">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="160" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.back-bar {
  margin-bottom: 16px;
}
.profile-card {
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  box-shadow: 0 6px 20px rgba(58, 142, 246, 0.25);
}
.profile-left {
  display: flex;
  align-items: center;
  gap: 18px;
}
.profile-avatar {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  border: 2px solid rgba(255, 255, 255, 0.6);
}
.profile-name {
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}
.profile-sub {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
  opacity: 0.92;
}
.profile-sub span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.profile-metrics {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.metric-item {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  padding: 12px 22px;
  text-align: center;
  min-width: 96px;
}
.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff !important;
}
.metric-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}
.detail-card {
  padding-top: 8px;
}
.money {
  color: #ff4d4f;
  font-weight: 600;
}
</style>
