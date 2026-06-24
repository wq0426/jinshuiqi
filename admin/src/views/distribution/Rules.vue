<script setup>
// 链动 2+1 分润规则配置
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 分润比例配置
const commission = reactive({
  directRate: 15, // 直推佣金
  indirectRate: 8, // 间推佣金
  sameLevelRate: 3, // 平级奖
  teamRate: 5, // 团队管理奖
  settleDays: 7 // 结算周期(天)
})

// 等级与升级条件
const levels = ref([
  { level: '普通会员', color: '#909399', condition: '注册即可', directReward: '—', benefit: '基础分润资格' },
  { level: '会员', color: '#faad14', condition: '累计消费满 ¥2000 或直推 3 人', directReward: '15%', benefit: '享直推+间推佣金' },
  { level: '合伙人', color: '#52c41a', condition: '团队人数满 30 人且本月业绩 ¥5万', directReward: '15% + 平级奖', benefit: '享全部分润 + 团队管理奖' }
])

// 链动 2+1 模式开关
const modelConfig = reactive({
  enabled: true,
  autoUpgrade: true,
  slideMode: true, // 滑落模式
  rewardModel: '2+1'
})

function save() {
  ElMessage.success('分润规则已保存并生效')
}
</script>

<template>
  <div class="page-container">
    <!-- 模式说明 -->
    <div class="app-card model-intro">
      <div class="intro-left">
        <div class="badge">链动 2+1</div>
        <h3>链动 2+1 分销模式</h3>
        <p>每位会员直推 2 人即可成为「合伙人」，系统自动将第 3 人滑落至上级，形成裂变。上级享受直推、间推、平级与团队管理多重分润，激励团队持续拓展。</p>
      </div>
      <div class="intro-flow">
        <div class="node me">我</div>
        <div class="arrow">↓ 直推</div>
        <div class="row">
          <div class="node a">A</div>
          <div class="node a">B</div>
          <div class="node slide">C 滑落↑</div>
        </div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom:16px">
          <div class="card-head"><span class="card-title">分润比例配置</span></div>
          <el-form label-width="120px" style="max-width:460px">
            <el-form-item label="直推佣金">
              <el-input-number v-model="commission.directRate" :min="0" :max="100" /> <span class="unit">%</span>
            </el-form-item>
            <el-form-item label="间推佣金">
              <el-input-number v-model="commission.indirectRate" :min="0" :max="100" /> <span class="unit">%</span>
            </el-form-item>
            <el-form-item label="平级奖">
              <el-input-number v-model="commission.sameLevelRate" :min="0" :max="100" /> <span class="unit">%</span>
            </el-form-item>
            <el-form-item label="团队管理奖">
              <el-input-number v-model="commission.teamRate" :min="0" :max="100" /> <span class="unit">%</span>
            </el-form-item>
            <el-form-item label="结算周期">
              <el-input-number v-model="commission.settleDays" :min="1" :max="90" /> <span class="unit">天</span>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :lg="12" :md="24">
        <div class="app-card" style="margin-bottom:16px">
          <div class="card-head"><span class="card-title">模式开关</span></div>
          <div class="switch-row"><span>启用链动 2+1 模式</span><el-switch v-model="modelConfig.enabled" /></div>
          <div class="switch-row"><span>满足条件自动升级</span><el-switch v-model="modelConfig.autoUpgrade" /></div>
          <div class="switch-row"><span>第 3 人自动滑落</span><el-switch v-model="modelConfig.slideMode" /></div>
          <el-form label-width="120px" style="margin-top:10px">
            <el-form-item label="奖励模型">
              <el-radio-group v-model="modelConfig.rewardModel">
                <el-radio-button label="2+1" />
                <el-radio-button label="1+1" />
                <el-radio-button label="3+2" />
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <div class="app-card" style="margin-bottom:16px">
      <div class="card-head"><span class="card-title">会员等级与升级条件</span></div>
      <el-table :data="levels" stripe>
        <el-table-column label="等级" width="160">
          <template #default="{ row }"><el-tag :color="row.color" effect="dark" style="border:none;color:#fff">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="condition" label="升级条件" min-width="220" />
        <el-table-column prop="directReward" label="可得分润" width="160" />
        <el-table-column prop="benefit" label="权益" min-width="200" />
      </el-table>
    </div>

    <div class="save-bar">
      <el-button type="primary" size="large" @click="save"><el-icon><Check /></el-icon>保存配置</el-button>
    </div>
  </div>
</template>

<style scoped>
.card-head { margin-bottom: 16px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
.model-intro { display: flex; justify-content: space-between; gap: 30px; margin-bottom: 16px; background: linear-gradient(135deg, #eef5ff, #e8fbfd); }
.intro-left { flex: 1; }
.badge { display: inline-block; background: linear-gradient(135deg, #3a8ef6, #26c6da); color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.intro-left h3 { margin: 14px 0 8px; color: #1f2533; }
.intro-left p { color: #5c6573; line-height: 1.8; font-size: 13px; margin: 0; }
.intro-flow { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.intro-flow .row { display: flex; gap: 12px; }
.node { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 13px; }
.node.me { background: linear-gradient(135deg, #3a8ef6, #26c6da); }
.node.a { background: #52c41a; }
.node.slide { background: #faad14; width: auto; padding: 0 12px; border-radius: 27px; font-size: 12px; }
.arrow { color: #909399; font-size: 12px; }
.unit { margin-left: 8px; color: #909399; }
.switch-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 4px; border-bottom: 1px solid #f0f2f5; color: #303133; }
.save-bar { text-align: center; padding: 10px 0; }
</style>
