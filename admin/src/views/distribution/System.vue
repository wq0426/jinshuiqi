<script setup>
// 分销体系：链动2+1 / 直推奖励 / 邀请奖励 / 阶梯升级 / 区域分红
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDistSystem, saveDistSystem } from '@/api'

const cfg = ref({
  chain21: { enabled: true, autoUpgrade: true, desc: '' },
  directReward: { enabled: true, rate: 15, desc: '' },
  inviteReward: { enabled: true, amount: 200, pointsAmount: 200, desc: '' },
  ladder: { enabled: true, levels: [] },
  regionDividend: { enabled: true, desc: '' }
})
onMounted(async () => {
  const data = await getDistSystem()
  if (data && Object.keys(data).length) cfg.value = data
})
async function save() {
  await saveDistSystem(cfg.value)
  ElMessage.success('分销体系配置已保存')
}
function addLevel() {
  cfg.value.ladder.levels.push({ level: '新等级', condition: '', directRate: 0, teamRate: 0 })
}
function delLevel(i) { cfg.value.ladder.levels.splice(i, 1) }
</script>

<template>
  <div class="page-container">
    <div class="app-card section">
      <div class="sec-head"><span class="card-title">链动 2+1 模式</span><el-switch v-model="cfg.chain21.enabled" /></div>
      <el-form label-width="120px" style="max-width:680px">
        <el-form-item label="模式说明"><el-input v-model="cfg.chain21.desc" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="自动升级团队长"><el-switch v-model="cfg.chain21.autoUpgrade" /></el-form-item>
      </el-form>
    </div>

    <div class="app-card section">
      <div class="sec-head"><span class="card-title">直推奖励</span><el-switch v-model="cfg.directReward.enabled" /></div>
      <el-form label-width="120px" style="max-width:680px">
        <el-form-item label="奖励比例(%)"><el-input-number v-model="cfg.directReward.rate" :min="0" :max="100" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="cfg.directReward.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
    </div>

    <div class="app-card section">
      <div class="sec-head"><span class="card-title">邀请奖励</span><el-switch v-model="cfg.inviteReward.enabled" /></div>
      <el-form label-width="120px" style="max-width:680px">
        <el-form-item label="现金奖励(元)"><el-input-number v-model="cfg.inviteReward.amount" :min="0" /></el-form-item>
        <el-form-item label="积分奖励"><el-input-number v-model="cfg.inviteReward.pointsAmount" :min="0" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="cfg.inviteReward.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
    </div>

    <div class="app-card section">
      <div class="sec-head"><span class="card-title">阶梯升级机制</span><el-switch v-model="cfg.ladder.enabled" /></div>
      <el-table :data="cfg.ladder.levels" border style="width:100%;max-width:840px">
        <el-table-column label="等级"><template #default="{ row }"><el-input v-model="row.level" /></template></el-table-column>
        <el-table-column label="升级条件"><template #default="{ row }"><el-input v-model="row.condition" /></template></el-table-column>
        <el-table-column label="直推佣金(%)" width="140"><template #default="{ row }"><el-input-number v-model="row.directRate" :min="0" :max="100" size="small" /></template></el-table-column>
        <el-table-column label="团队佣金(%)" width="140"><template #default="{ row }"><el-input-number v-model="row.teamRate" :min="0" :max="100" size="small" /></template></el-table-column>
        <el-table-column label="操作" width="80"><template #default="{ $index }"><el-button link type="danger" @click="delLevel($index)">删除</el-button></template></el-table-column>
      </el-table>
      <el-button size="small" style="margin-top:10px" @click="addLevel">添加等级</el-button>
    </div>

    <div class="app-card section">
      <div class="sec-head"><span class="card-title">区域分红机制</span><el-switch v-model="cfg.regionDividend.enabled" /></div>
      <el-form label-width="120px" style="max-width:680px">
        <el-form-item label="说明"><el-input v-model="cfg.regionDividend.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <el-alert title="区域分红明细可在「区域分红」菜单中按区域查看与调整" type="info" :closable="false" show-icon />
    </div>

    <div style="text-align:center;margin-top:8px">
      <el-button type="primary" size="large" @click="save">保存全部配置</el-button>
    </div>
  </div>
</template>

<style scoped>
.section { padding: 18px 20px; margin-bottom: 16px; }
.sec-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
</style>
