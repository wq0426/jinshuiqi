<script setup>
// 系统-账号设置
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAccounts, createAccount, updateAccount, deleteAccount, getRoles } from '@/api'

const list = ref([])
const roles = ref([])
async function load() { list.value = await getAccounts() }
onMounted(async () => { load(); roles.value = await getRoles() })

const dialog = reactive({ show: false, edit: false, form: {} })
function openAdd() {
  dialog.edit = false
  dialog.form = { username: '', name: '', roleCode: '', phone: '', status: 'enabled' }
  dialog.show = true
}
function openEdit(row) { dialog.edit = true; dialog.form = { ...row }; dialog.show = true }
async function submit() {
  if (!dialog.form.username || !dialog.form.name) return ElMessage.warning('请填写用户名和姓名')
  const role = roles.value.find((r) => r.code === dialog.form.roleCode)
  dialog.form.role = role ? role.name : ''
  if (dialog.edit) await updateAccount(dialog.form.id, dialog.form)
  else await createAccount(dialog.form)
  dialog.show = false; ElMessage.success('保存成功'); load()
}
async function remove(row) {
  await ElMessageBox.confirm(`确定删除账号「${row.name}」？`, '提示', { type: 'warning' })
  await deleteAccount(row.id); ElMessage.success('已删除'); load()
}
async function toggle(row) {
  await updateAccount(row.id, { ...row, status: row.status === 'enabled' ? 'disabled' : 'enabled' })
  load()
}
</script>

<template>
  <div class="page-container">
    <div class="table-card">
      <div class="card-head">
        <span class="card-title">管理账号</span>
        <el-button type="primary" size="small" style="margin-left:auto" @click="openAdd">新增账号</el-button>
      </div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column prop="username" label="用户名" width="130" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="130" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === 'enabled' ? 'success' : 'info'" effect="light">{{ row.status === 'enabled' ? '启用' : '停用' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最近登录" min-width="150" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link :type="row.status === 'enabled' ? 'warning' : 'success'" @click="toggle(row)">{{ row.status === 'enabled' ? '停用' : '启用' }}</el-button>
            <el-button link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialog.show" :title="dialog.edit ? '编辑账号' : '新增账号'" width="460px">
      <el-form label-width="80px">
        <el-form-item label="用户名"><el-input v-model="dialog.form.username" /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="dialog.form.name" /></el-form-item>
        <el-form-item label="角色">
          <el-select v-model="dialog.form.roleCode" placeholder="选择角色" style="width:100%">
            <el-option v-for="r in roles" :key="r.code" :label="r.name" :value="r.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号"><el-input v-model="dialog.form.phone" /></el-form-item>
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
