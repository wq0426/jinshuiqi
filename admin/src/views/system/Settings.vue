<script setup>
// 系统设置
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSettings, saveSettings } from '@/api'

const activeTab = reactive({ name: 'base' })

const base = reactive({
  siteName: '德康泉管理系统',
  logo: '泉',
  contact: '400-888-6666',
  desc: '德康泉净水上门服务、商城、物联网设备管理一体化平台'
})
const iot = reactive({
  baseUrl: 'https://iot.example.com',
  appKey: 'jsq_iot_app_key_2026',
  appSecret: '****************',
  syncInterval: 5
})
const wx = reactive({
  appid: 'wx1234567890abcdef',
  secret: '****************',
  mchId: '1600000000'
})
const security = reactive({
  loginVerify: true,
  ipWhitelist: false,
  pwdExpire: 90
})

// 加载已保存设置（覆盖默认值）
onMounted(async () => {
  const data = await getSettings()
  if (data?.base) Object.assign(base, data.base)
  if (data?.iot) Object.assign(iot, data.iot)
  if (data?.wx) Object.assign(wx, data.wx)
  if (data?.security) Object.assign(security, data.security)
})

async function save(name) {
  await saveSettings({ base, iot, wx, security })
  ElMessage.success(`「${name}」配置已保存`)
}
</script>

<template>
  <div class="page-container">
    <div class="app-card">
      <el-tabs v-model="activeTab.name">
        <el-tab-pane label="基本信息" name="base">
          <el-form label-width="120px" style="max-width:560px">
            <el-form-item label="平台名称"><el-input v-model="base.siteName" /></el-form-item>
            <el-form-item label="平台 Logo">
              <div class="logo-box">{{ base.logo }}</div>
              <el-button size="small" style="margin-left:12px">更换</el-button>
            </el-form-item>
            <el-form-item label="客服电话"><el-input v-model="base.contact" /></el-form-item>
            <el-form-item label="平台简介"><el-input v-model="base.desc" type="textarea" :rows="3" /></el-form-item>
            <el-form-item><el-button type="primary" @click="save('基本信息')">保存</el-button></el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="IoT 物联网平台" name="iot">
          <el-alert title="对接净水器厂家物联网平台，用于设备状态同步与远程控制" type="info" :closable="false" style="margin-bottom:20px" />
          <el-form label-width="120px" style="max-width:560px">
            <el-form-item label="平台地址"><el-input v-model="iot.baseUrl" /></el-form-item>
            <el-form-item label="AppKey"><el-input v-model="iot.appKey" /></el-form-item>
            <el-form-item label="AppSecret"><el-input v-model="iot.appSecret" show-password /></el-form-item>
            <el-form-item label="同步间隔">
              <el-input-number v-model="iot.syncInterval" :min="1" :max="60" /><span class="unit">分钟</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save('IoT 平台')">保存</el-button>
              <el-button @click="ElMessage.success('连接测试成功')">测试连接</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="微信小程序" name="wx">
          <el-form label-width="120px" style="max-width:560px">
            <el-form-item label="小程序 AppID"><el-input v-model="wx.appid" /></el-form-item>
            <el-form-item label="AppSecret"><el-input v-model="wx.secret" show-password /></el-form-item>
            <el-form-item label="商户号"><el-input v-model="wx.mchId" /></el-form-item>
            <el-form-item><el-button type="primary" @click="save('微信小程序')">保存</el-button></el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <el-form label-width="140px" style="max-width:560px">
            <el-form-item label="登录二次验证"><el-switch v-model="security.loginVerify" /></el-form-item>
            <el-form-item label="IP 白名单"><el-switch v-model="security.ipWhitelist" /></el-form-item>
            <el-form-item label="密码有效期">
              <el-input-number v-model="security.pwdExpire" :min="0" :max="365" /><span class="unit">天（0 为永久）</span>
            </el-form-item>
            <el-form-item><el-button type="primary" @click="save('安全设置')">保存</el-button></el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.logo-box { display: inline-flex; width: 56px; height: 56px; border-radius: 12px; background: linear-gradient(135deg, #3a8ef6, #26c6da); color: #fff; font-size: 24px; font-weight: 700; align-items: center; justify-content: center; vertical-align: middle; }
.unit { margin-left: 8px; color: #909399; }
</style>
