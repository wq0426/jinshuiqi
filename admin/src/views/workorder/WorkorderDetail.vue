<script setup>
// 工单详情 / 跟单页面
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWorkorder } from '@/api'
import {
  workorderTypeColor,
  workorderStatusColor,
  workorderStatuses
} from '@/constants'

const route = useRoute()
const router = useRouter()

// 工单详情（接口拉取），先用空默认占位
const order = ref({
  id: '', type: '', status: '', customer: '', phone: '', address: '',
  deviceModel: '', deviceSn: '', technician: '', createTime: '',
  appointTime: '', remark: '', timeline: [], photos: []
})
onMounted(async () => {
  order.value = await getWorkorder(route.params.id)
})

// 当前状态在完整流程中的索引（el-steps active）
const activeStep = computed(() => {
  const idx = workorderStatuses.indexOf(order.value.status)
  // 已完成时全部点亮
  return order.value.status === '已完成' ? workorderStatuses.length : idx
})

function goBack() {
  router.back()
}
</script>

<template>
  <div class="page-container">
    <!-- 头部 -->
    <div class="detail-head app-card">
      <div class="head-left">
        <el-button @click="goBack"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        <span class="wo-id">{{ order.id }}</span>
        <el-tag :type="workorderTypeColor[order.type]" effect="dark">{{ order.type }}</el-tag>
        <el-tag :type="workorderStatusColor[order.status]" effect="light" size="large">{{ order.status }}</el-tag>
      </div>
    </div>

    <!-- 状态流程 -->
    <div class="app-card section">
      <div class="section-title"><el-icon><Guide /></el-icon>工单进度</div>
      <el-steps :active="activeStep" align-center finish-status="success" process-status="finish">
        <el-step v-for="s in workorderStatuses" :key="s" :title="s" />
      </el-steps>
    </div>

    <el-row :gutter="16">
      <!-- 详细时间线 -->
      <el-col :span="10">
        <div class="app-card section full-h">
          <div class="section-title"><el-icon><Clock /></el-icon>跟单记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(t, i) in order.timeline"
              :key="i"
              :timestamp="t.time"
              :type="i === order.timeline.length - 1 ? 'primary' : 'success'"
              placement="top"
            >
              <div class="tl-status">
                <el-tag :type="workorderStatusColor[t.status]" effect="plain" size="small">{{ t.status }}</el-tag>
              </div>
              <div class="tl-desc">{{ t.desc }}</div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>

      <!-- 信息卡片 -->
      <el-col :span="14">
        <div class="app-card section">
          <div class="section-title"><el-icon><User /></el-icon>客户信息</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户姓名">{{ order.customer }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ order.phone }}</el-descriptions-item>
            <el-descriptions-item label="服务地址" :span="2">{{ order.address }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="app-card section">
          <div class="section-title"><el-icon><Monitor /></el-icon>设备信息</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="设备型号">{{ order.deviceModel }}</el-descriptions-item>
            <el-descriptions-item label="设备序列号">{{ order.deviceSn }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="app-card section">
          <div class="section-title"><el-icon><Avatar /></el-icon>师傅信息</div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="服务师傅">
              <span v-if="order.technician">{{ order.technician }}</span>
              <el-tag v-else type="info" effect="plain" size="small">未派单</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="app-card section">
          <div class="section-title"><el-icon><Tickets /></el-icon>预约 / 备注</div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="预约时间">{{ order.appointTime }}</el-descriptions-item>
            <el-descriptions-item label="备注信息">{{ order.remark || '无' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
    </el-row>

    <!-- 服务照片 -->
    <div class="app-card section">
      <div class="section-title"><el-icon><Picture /></el-icon>服务照片</div>
      <div v-if="order.photos && order.photos.length" class="photo-grid">
        <div v-for="(p, i) in order.photos" :key="i" class="photo-item" :style="{ background: p }">
          <el-icon :size="28"><Picture /></el-icon>
        </div>
      </div>
      <el-empty v-else description="暂无照片" :image-size="80" />
    </div>
  </div>
</template>

<style scoped>
.detail-head {
  margin-bottom: 16px;
}
.head-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.wo-id {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}
.section {
  margin-bottom: 16px;
}
.full-h {
  height: calc(100% - 16px);
}
.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 18px;
}
.section-title .el-icon {
  color: #3a8ef6;
}
.tl-status {
  margin-bottom: 4px;
}
.tl-desc {
  font-size: 13px;
  color: #606266;
}
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
}
.photo-item {
  height: 120px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
</style>
