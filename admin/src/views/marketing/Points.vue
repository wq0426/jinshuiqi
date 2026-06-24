<script setup>
// 营销-积分功能：积分规则 + 积分明细
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPointRules, createPointRule, updatePointRule, deletePointRule,
  getPointRecords, exportCsv
} from '@/api'

const tab = ref('rules')
const rules = ref([])
const records = ref([])

async function loadRules() { rules.value = await getPointRules() }
async function loadRecords() { records.value = await getPointRecords() }
onMounted(() => { loadRules(); loadRecords() })

const dialog = reactive({ show: false, edit: false, form: {} })
function openAdd() {
  dialog.edit = false
  dialog.form = { name: '', event: '', points: 0, desc: '', enabled: true }
  dialog.show = true
}
function openEdit(row) {
  dialog.edit = true
  dialog.form = { ...row }
  dialog.show = true
}
async function submit() {
  if (!dialog.form.name) return ElMessage.warning('请填写规则名称')
  if (dialog.edit) await updatePointRule(dialog.form.id, dialog.form)
  else await createPointRule(dialog.form)
  dialog.show = false
  ElMessage.success('保存成功')
  loadRules()
}
async function remove(row) {
  await ElMessageBox.confirm(`确定删除规则「${row.name}」？`, '提示', { type: 'warning' })
  await deletePointRule(row.id)
  ElMessage.success('已删除')
  loadRules()
}
async function toggle(row) {
  await updatePointRule(row.id, { ...row, enabled: row.enabled })
}
function doExport() {
  exportCsv('积分明细', [
    { prop: 'id', label: '流水号' }, { prop: 'customer', label: '客户' },
    { prop: 'phone', label: '手机号' }, { prop: 'type', label: '类型' },
    { prop: 'points', label: '积分' }, { prop: 'reason', label: '事由' },
    { prop: 'balance', label: '余额' }, { prop: 'time', label: '时间' }
  ], records.value)
}
</script>

<template>
  <div class="page-container">
    <el-tabs v-model="tab" class="app-card" style="padding:8px 16px">
      <el-tab-pane label="积分规则" name="rules">
        <div style="margin-bottom:12px"><el-button type="primary" @click="openAdd">新增规则</el-button></div>
        <el-table :data="rules" stripe style="width:100%">
          <el-table-column prop="name" label="规则名称" min-width="140" />
          <el-table-column prop="event" label="触发事件" width="140" />
          <el-table-column prop="points" label="积分值" width="100" />
          <el-table-column prop="desc" label="说明" min-width="220" />
          <el-table-column label="启用" width="90">
            <template #default="{ row }"><el-switch v-model="row.enabled" @change="toggle(row)" /></template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="积分明细" name="records">
        <div style="margin-bottom:12px"><el-button @click="doExport">导出 CSV</el-button></div>
        <el-table :data="records" stripe style="width:100%">
          <el-table-column prop="id" label="流水号" width="150" />
          <el-table-column prop="customer" label="客户" width="100" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column label="类型" width="90">
            <template #default="{ row }">
              <el-tag :type="row.type === 'earn' ? 'success' : 'warning'" effect="light">{{ row.type === 'earn' ? '获取' : '消耗' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="积分" width="100">
            <template #default="{ row }"><span :style="{ color: row.type === 'earn' ? '#52c41a' : '#ff4d4f' }">{{ row.type === 'earn' ? '+' : '-' }}{{ row.points }}</span></template>
          </el-table-column>
          <el-table-column prop="reason" label="事由" min-width="140" />
          <el-table-column prop="balance" label="积分余额" width="100" />
          <el-table-column prop="time" label="时间" min-width="150" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialog.show" :title="dialog.edit ? '编辑规则' : '新增规则'" width="460px">
      <el-form label-width="90px">
        <el-form-item label="规则名称"><el-input v-model="dialog.form.name" /></el-form-item>
        <el-form-item label="触发事件"><el-input v-model="dialog.form.event" placeholder="如 register / sign / order" /></el-form-item>
        <el-form-item label="积分值"><el-input-number v-model="dialog.form.points" :min="0" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="dialog.form.desc" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="dialog.form.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
