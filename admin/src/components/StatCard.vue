<template>
  <div class="stat-card">
    <div class="stat-icon" :style="{ background: gradient }">
      <el-icon :size="26"><component :is="icon" /></el-icon>
    </div>
    <div class="stat-body">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value">
        {{ prefix }}<span class="num">{{ value }}</span>{{ suffix }}
      </div>
      <div class="stat-trend" v-if="trend !== undefined">
        <span :class="trend >= 0 ? 'up' : 'down'">
          <el-icon><component :is="trend >= 0 ? 'Top' : 'Bottom'" /></el-icon>
          {{ Math.abs(trend) }}%
        </span>
        <span class="trend-label">较昨日</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  trend: { type: Number, default: undefined },
  gradient: {
    type: String,
    default: 'linear-gradient(135deg, #3A8EF6 0%, #26C6DA 100%)'
  }
})
</script>

<style scoped lang="scss">
.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 22px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s, box-shadow 0.25s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(58, 142, 246, 0.15);
  }
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.stat-body {
  flex: 1;
  min-width: 0;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}
.stat-value {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
  .num {
    font-size: 26px;
    font-weight: 700;
  }
}
.stat-trend {
  margin-top: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  .up {
    color: #52c41a;
    display: inline-flex;
    align-items: center;
  }
  .down {
    color: #ff4d4f;
    display: inline-flex;
    align-items: center;
  }
  .trend-label {
    color: #c0c4cc;
  }
}
</style>
