<script setup>
// 系统-消息通知（站内消息）
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getNotices, readNotice } from '@/api'

const list = ref([])
async function load() { list.value = await getNotices() }
onMounted(load)
const typeMap = { order: { t: 'primary', l: '订单' }, alert: { t: 'danger', l: '预警' }, system: { t: 'info', l: '系统' } }
async function markRead(row) {
  if (row.status === 'read') return
  await readNotice(row.id); ElMessage.success('已读'); load()
}
</script>

<template>
  <div class="page-container">
    <div class="table-card">
      <div class="card-head"><span class="card-title">站内消息通知</span></div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column label="类型" width="90">
          <template #default="{ row }"><el-tag :type="typeMap[row.type]?.t" effect="light">{{ typeMap[row.type]?.l }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="160" />
        <el-table-column prop="content" label="内容" min-width="280" />
        <el-table-column prop="target" label="接收对象" width="130" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === 'unread' ? 'warning' : 'success'" effect="light">{{ row.status === 'unread' ? '未读' : '已读' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }"><el-button link type="primary" :disabled="row.status === 'read'" @click="markRead(row)">标记已读</el-button></template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.card-head { margin-bottom: 14px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
</style>
