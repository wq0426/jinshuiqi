<script setup>
// 师傅管理-入驻审核
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTechApplies, auditTechApply } from '@/api'

const list = ref([])
async function load() { list.value = await getTechApplies() }
onMounted(load)

const statusMap = { pending: { t: 'warning', l: '待审核' }, approved: { t: 'success', l: '已通过' }, rejected: { t: 'danger', l: '已拒绝' } }
const filters = reactive({ status: '' })
const filtered = computed(() => list.value.filter((r) => !filters.status || r.status === filters.status))

async function approve(row) {
  await ElMessageBox.confirm(`确认通过「${row.name}」的入驻申请？通过后将自动加入师傅库。`, '审核', { type: 'success' })
  await auditTechApply(row.id, 'approved'); ElMessage.success('已通过'); load()
}
async function reject(row) {
  const { value } = await ElMessageBox.prompt('请输入拒绝原因', '审核', { inputPlaceholder: '拒绝原因' })
  await auditTechApply(row.id, 'rejected', value || '资质不符'); ElMessage.success('已拒绝'); load()
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-radio-group v-model="filters.status">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="pending">待审核</el-radio-button>
        <el-radio-button value="approved">已通过</el-radio-button>
        <el-radio-button value="rejected">已拒绝</el-radio-button>
      </el-radio-group>
    </div>
    <div class="table-card">
      <el-table :data="filtered" stripe style="width:100%">
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="area" label="服务区域" width="120" />
        <el-table-column prop="idcard" label="身份证" width="160" />
        <el-table-column prop="experience" label="从业经验" min-width="150" />
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><el-tag :type="statusMap[row.status].t" effect="light">{{ statusMap[row.status].l }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="120" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button link type="success" @click="approve(row)">通过</el-button>
              <el-button link type="danger" @click="reject(row)">拒绝</el-button>
            </template>
            <span v-else style="color:#bbb">已处理</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
