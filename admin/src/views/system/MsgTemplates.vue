<script setup>
// 通知消息模板
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMsgTemplates, createMsgTemplate, updateMsgTemplate, deleteMsgTemplate } from '@/api'

const channelMap = { wx: '微信', sms: '短信', site: '站内' }
const list = ref([])
async function load() { list.value = await getMsgTemplates() }
onMounted(load)

const dialog = reactive({ show: false, edit: false, form: {} })
function openAdd() {
  dialog.edit = false
  dialog.form = { name: '', scene: '', channel: 'wx', content: '', status: 'enabled' }
  dialog.show = true
}
function openEdit(row) { dialog.edit = true; dialog.form = { ...row }; dialog.show = true }
async function submit() {
  if (!dialog.form.name) return ElMessage.warning('请填写模板名称')
  if (dialog.edit) await updateMsgTemplate(dialog.form.id, dialog.form)
  else await createMsgTemplate(dialog.form)
  dialog.show = false; ElMessage.success('保存成功'); load()
}
async function remove(row) {
  await ElMessageBox.confirm(`确定删除模板「${row.name}」？`, '提示', { type: 'warning' })
  await deleteMsgTemplate(row.id); ElMessage.success('已删除'); load()
}
async function toggle(row) {
  await updateMsgTemplate(row.id, { ...row, status: row.status === 'enabled' ? 'disabled' : 'enabled' }); load()
}
</script>

<template>
  <div class="page-container">
    <div class="table-card">
      <div class="card-head">
        <span class="card-title">消息通知模板</span>
        <el-button type="primary" size="small" style="margin-left:auto" @click="openAdd">新增模板</el-button>
      </div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column prop="name" label="模板名称" width="160" />
        <el-table-column prop="scene" label="场景标识" width="160" />
        <el-table-column label="渠道" width="90">
          <template #default="{ row }"><el-tag effect="light">{{ channelMap[row.channel] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="content" label="模板内容" min-width="300" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === 'enabled' ? 'success' : 'info'" effect="light">{{ row.status === 'enabled' ? '启用' : '停用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link :type="row.status === 'enabled' ? 'warning' : 'success'" @click="toggle(row)">{{ row.status === 'enabled' ? '停用' : '启用' }}</el-button>
            <el-button link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialog.show" :title="dialog.edit ? '编辑模板' : '新增模板'" width="520px">
      <el-form label-width="90px">
        <el-form-item label="模板名称"><el-input v-model="dialog.form.name" /></el-form-item>
        <el-form-item label="场景标识"><el-input v-model="dialog.form.scene" placeholder="如 order_paid" /></el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="dialog.form.channel" style="width:160px">
            <el-option v-for="(v, k) in channelMap" :key="k" :label="v" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="dialog.form.content" type="textarea" :rows="3" placeholder="可用 {customer} {orderId} {amount} 等占位符" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dialog.form.status">
            <el-radio value="enabled">启用</el-radio>
            <el-radio value="disabled">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-head { display: flex; align-items: center; margin-bottom: 14px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
</style>
