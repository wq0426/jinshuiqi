<template>
  <div class="login-page">
    <!-- 左侧品牌渐变插画区（纯 CSS 绘制） -->
    <div class="brand">
      <div class="brand-inner">
        <div class="brand-logo"><img src="/logo.svg" alt="德康泉" class="brand-logo-img" /> 德康泉</div>
        <h1 class="brand-title">德康泉净水上门服务平台</h1>
        <p class="brand-sub">IoT 设备物联 · 智能工单调度 · 链动分销 · 数据大屏</p>
        <!-- CSS 绘制的装饰图形 -->
        <div class="illustration">
          <div class="drop d1"></div>
          <div class="drop d2"></div>
          <div class="drop d3"></div>
          <div class="ring r1"></div>
          <div class="ring r2"></div>
          <div class="wave"></div>
        </div>
        <div class="brand-tags">
          <span>水质实时监测</span>
          <span>滤芯智能提醒</span>
          <span>一键远程控制</span>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="form-area">
      <div class="login-card">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-tip">德康泉 · 管理后台</p>
        <el-form :model="form" :rules="rules" ref="formRef" size="large">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入账号" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="请输入密码"
              :prefix-icon="Lock"
              @keyup.enter="onLogin"
            />
          </el-form-item>
          <div class="form-extra">
            <el-checkbox v-model="remember">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
          <el-button type="primary" class="login-btn" :loading="loading" @click="onLogin">
            登 录
          </el-button>
          <p class="login-hint">提示：任意账号密码均可登录（演示）</p>
        </el-form>
      </div>
      <div class="copyright">© 2026 德康泉管理系统 · Powered by Vue3 + Element Plus</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const remember = ref(true)
const form = reactive({ username: 'admin', password: '123456' })
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function onLogin() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login(form.username, form.password)
      ElMessage.success('登录成功，欢迎回来！')
      router.push('/dashboard')
    } catch (e) {
      // 错误已由请求层统一提示
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.login-page {
  height: 100%;
  display: flex;
}

// 左侧品牌区
.brand {
  flex: 1.2;
  background: linear-gradient(135deg, #3a8ef6 0%, #26c6da 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.brand-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 40px;
}
.brand-logo {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo-img {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}
.brand-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 16px;
  letter-spacing: 2px;
}
.brand-sub {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
}
.brand-tags {
  margin-top: 40px;
  display: flex;
  gap: 14px;
  justify-content: center;
  span {
    background: rgba(255, 255, 255, 0.18);
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 14px;
    backdrop-filter: blur(4px);
  }
}

// CSS 插画
.illustration {
  position: relative;
  height: 180px;
  margin: 20px auto;
  width: 280px;
}
.drop {
  position: absolute;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50% 50% 50% 0;
  transform: rotate(45deg);
  animation: float 3s ease-in-out infinite;
}
.d1 { width: 60px; height: 60px; left: 40px; top: 20px; }
.d2 { width: 40px; height: 40px; right: 60px; top: 60px; animation-delay: 0.6s; opacity: 0.7; }
.d3 { width: 28px; height: 28px; left: 120px; top: 100px; animation-delay: 1.2s; opacity: 0.5; }
.ring {
  position: absolute;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}
.r1 { width: 160px; height: 160px; left: 30px; top: 10px; }
.r2 { width: 220px; height: 220px; left: 0; top: -20px; animation-delay: 1s; }
.wave {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  filter: blur(10px);
}
@keyframes float {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50% { transform: rotate(45deg) translateY(-14px); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.08); opacity: 0.5; }
}

// 右侧表单
.form-area {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.login-card {
  width: 360px;
}
.login-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #1f2533;
}
.login-tip {
  color: #909399;
  margin: 0 0 36px;
  font-size: 14px;
}
.form-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.login-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #3a8ef6 0%, #26c6da 100%);
  border: none;
}
.login-hint {
  text-align: center;
  color: #c0c4cc;
  font-size: 12px;
  margin-top: 18px;
}
.copyright {
  position: absolute;
  bottom: 24px;
  color: #c0c4cc;
  font-size: 12px;
}
</style>
