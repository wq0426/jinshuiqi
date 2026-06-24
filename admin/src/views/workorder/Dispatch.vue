<script setup>
// 派单中心
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getWorkorders, getTechnicians, dispatchWorkorder } from '@/api'
import { workorderTypeColor } from '@/constants'

// 待派单列表（接口拉取后过滤“已下单”）
const pending = ref([])
const technicians = ref([])
onMounted(async () => {
  const [wos, techs] = await Promise.all([getWorkorders(), getTechnicians()])
  pending.value = wos.filter((w) => w.status === '已下单')
  technicians.value = techs
})

// 可用师傅（在线）
const onlineTechs = computed(() => technicians.value.filter((t) => t.online))

// 派单弹窗
const dialogVisible = ref(false)
const current = ref(null)
const selectedTechId = ref('')

function openDispatch(row) {
  current.value = row
  selectedTechId.value = ''
  dialogVisible.value = true
}

async function confirmDispatch() {
  if (!selectedTechId.value) {
    ElMessage.warning('请选择一位师傅')
    return
  }
  const tech = onlineTechs.value.find((t) => t.id === selectedTechId.value)
  // 调用派单接口，成功后从待派单列表移除
  await dispatchWorkorder(current.value.id, tech.name)
  pending.value = pending.value.filter((w) => w.id !== current.value.id)
  dialogVisible.value = false
  ElMessage.success(`已指派给 ${tech.name}`)
}
</script>

<template>
  <div class="page-container">
    <!-- 顶部说明 -->
    <div class="dispatch-head app-card">
      <div class="head-left">
        <div class="head-title gradient-text">派单中心</div>
        <div class="head-desc">为待派单工单指派合适的上门师傅</div>
      </div>
      <div class="head-stat">
        <span class="stat-num">{{ pending.length }}</span>
        <span class="stat-label">待派单工单</span>
      </div>
    </div>

    <!-- 待派单表格 -->
    <div class="table-card">
      <el-table :data="pending" stripe style="width: 100%">
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
        <el-table-column label="地址" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">{{ row.address }}</template>
        </el-table-column>
        <el-table-column prop="appointTime" label="预约时间" width="170" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" @click="openDispatch(row)"><el-icon><Promotion /></el-icon>指派</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无待派单工单" />
        </template>
      </el-table>
    </div>

    <!-- 指派弹窗 -->
    <el-dialog v-model="dialogVisible" title="指派师傅" width="640px">
      <div v-if="current">
        <!-- 工单摘要 -->
        <div class="wo-summary">
          <div class="summary-row">
            <span class="s-id">{{ current.id }}</span>
            <el-tag :type="workorderTypeColor[current.type]" effect="dark">{{ current.type }}</el-tag>
          </div>
          <div class="summary-info">
            <span><el-icon><User /></el-icon>{{ current.customer }} · {{ current.phone }}</span>
            <span><el-icon><LocationFilled /></el-icon>{{ current.address }}</span>
            <span><el-icon><Clock /></el-icon>预约 {{ current.appointTime }}</span>
          </div>
        </div>

        <div class="tech-title">选择可派师傅（在线 {{ onlineTechs.length }} 人）</div>

        <!-- 可选师傅卡片 -->
        <div class="tech-grid">
          <div
            v-for="t in onlineTechs"
            :key="t.id"
            class="tech-card"
            :class="{ active: selectedTechId === t.id }"
            @click="selectedTechId = t.id"
          >
            <div class="tech-avatar"><el-icon :size="22"><Avatar /></el-icon></div>
            <div class="tech-main">
              <div class="tech-name">
                {{ t.name }}
                <el-tag size="small" type="warning" effect="plain">{{ t.level }}</el-tag>
              </div>
              <div class="tech-meta">
                <span><el-icon><LocationFilled /></el-icon>{{ t.area }}</span>
              </div>
              <div class="tech-meta">
                <span><el-icon><Star /></el-icon>{{ t.rating }}</span>
                <span class="ongoing">在途 {{ t.ongoing }}</span>
              </div>
            </div>
            <el-icon v-if="selectedTechId === t.id" class="tech-check"><CircleCheckFilled /></el-icon>
          </div>
        </div>
        <el-empty v-if="!onlineTechs.length" description="暂无在线师傅" />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDispatch">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dispatch-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.head-title {
  font-size: 20px;
  font-weight: 700;
}
.head-desc {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.head-stat {
  text-align: center;
}
.stat-num {
  font-size: 30px;
  font-weight: 700;
  color: #3a8ef6;
  margin-right: 6px;
}
.stat-label {
  font-size: 13px;
  color: #909399;
}
.cust-name {
  color: #303133;
  font-weight: 500;
}
.cust-phone {
  color: #909399;
  font-size: 12px;
}

/* 工单摘要 */
.wo-summary {
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  border-radius: 10px;
  padding: 16px 18px;
  color: #fff;
  margin-bottom: 18px;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.s-id {
  font-size: 16px;
  font-weight: 600;
}
.summary-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}
.summary-info span {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.95;
}
.tech-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

/* 师傅卡片 */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
}
.tech-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.tech-card:hover {
  border-color: #3a8ef6;
}
.tech-card.active {
  border-color: #3a8ef6;
  background: #ecf5ff;
  box-shadow: 0 4px 12px rgba(58, 142, 246, 0.18);
}
.tech-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tech-main {
  flex: 1;
  min-width: 0;
}
.tech-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
}
.tech-meta {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.tech-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.tech-meta .ongoing {
  color: #faad14;
}
.tech-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #3a8ef6;
  font-size: 18px;
}
</style>
