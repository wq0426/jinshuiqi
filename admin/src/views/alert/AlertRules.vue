<script setup>
// 预警规则配置
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAlertRules, saveAlertRules } from '@/api'
import { alertLevelColor } from '@/constants'

const rules = ref([])
onMounted(async () => {
  rules.value = await getAlertRules()
})

// 通知方式
const notify = ref({ sms: true, wechat: true, system: true, email: false })

async function save() {
  await saveAlertRules(rules.value)
  ElMessage.success('预警规则已保存')
}
function toggle(row) {
  ElMessage.success(`「${row.type}」预警已${row.enabled ? '开启' : '关闭'}`)
}
</script>

<template>
  <div class="page-container">
    <div class="app-card" style="margin-bottom:16px">
      <div class="card-head"><span class="card-title">预警规则</span><span class="card-tip">设置各类预警的触发阈值，达到阈值时自动生成预警</span></div>
      <el-table :data="rules" stripe>
        <el-table-column prop="type" label="预警类型" width="140" />
        <el-table-column prop="desc" label="说明" min-width="260" />
        <el-table-column label="触发阈值" width="220">
          <template #default="{ row }">
            <el-input-number v-model="row.threshold" :min="0" size="small" controls-position="right" style="width:120px" />
            <span class="unit">{{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预警等级" width="140">
          <template #default="{ row }">
            <el-select v-model="row.level" size="small" style="width:90px">
              <el-option label="高" value="高" />
              <el-option label="中" value="中" />
              <el-option label="低" value="低" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="90">
          <template #default="{ row }"><el-switch v-model="row.enabled" @change="toggle(row)" /></template>
        </el-table-column>
      </el-table>
    </div>

    <div class="app-card" style="margin-bottom:16px">
      <div class="card-head"><span class="card-title">通知方式</span></div>
      <div class="notify-grid">
        <div class="notify-item"><span>📱 短信通知</span><el-switch v-model="notify.sms" /></div>
        <div class="notify-item"><span>💬 微信通知</span><el-switch v-model="notify.wechat" /></div>
        <div class="notify-item"><span>🔔 系统站内信</span><el-switch v-model="notify.system" /></div>
        <div class="notify-item"><span>📧 邮件通知</span><el-switch v-model="notify.email" /></div>
      </div>
    </div>

    <div class="save-bar"><el-button type="primary" size="large" @click="save"><el-icon><Check /></el-icon>保存规则</el-button></div>
  </div>
</template>

<style scoped>
.card-head { margin-bottom: 16px; display: flex; align-items: baseline; gap: 12px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
.card-tip { color: #909399; font-size: 12px; }
.unit { margin-left: 8px; color: #909399; }
.notify-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
.notify-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px; background: #f7f9fc; border-radius: 8px; color: #303133; }
.save-bar { text-align: center; padding: 10px 0; }
</style>
