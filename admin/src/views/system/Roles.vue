<script setup>
// 系统-角色设置 / 权限设置
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoles, createRole, updateRole, deleteRole } from '@/api'

const ALL_PERMS = [
  { key: 'dashboard', label: '工作台' }, { key: 'mall', label: '商城管理' },
  { key: 'device', label: '设备管理' }, { key: 'workorder', label: '服务工单' },
  { key: 'distribution', label: '分销管理' }, { key: 'customer', label: '客户管理' },
  { key: 'recharge', label: '充值管理' }, { key: 'inventory', label: '库存管理' },
  { key: 'marketing', label: '营销中心' }, { key: 'ranking', label: '排行榜' },
  { key: 'system', label: '系统设置' }
]
const list = ref([])
async function load() { list.value = await getRoles() }
onMounted(load)

const dialog = reactive({ show: false, edit: false, form: {} })
function openAdd() {
  dialog.edit = false
  dialog.form = { name: '', code: '', permissions: [], desc: '', status: 'enabled' }
  dialog.show = true
}
function openEdit(row) { dialog.edit = true; dialog.form = { ...row, permissions: [...(row.permissions || [])] }; dialog.show = true }
async function submit() {
  if (!dialog.form.name || !dialog.form.code) return ElMessage.warning('请填写角色名称和编码')
  if (dialog.edit) await updateRole(dialog.form.id, dialog.form)
  else await createRole(dialog.form)
  dialog.show = false; ElMessage.success('保存成功'); load()
}
async function remove(row) {
  await ElMessageBox.confirm(`确定删除角色「${row.name}」？`, '提示', { type: 'warning' })
  await deleteRole(row.id); ElMessage.success('已删除'); load()
}
const permLabel = (k) => ALL_PERMS.find((p) => p.key === k)?.label || k
</script>

<template>
  <div class="page-container">
    <div class="table-card">
      <div class="card-head">
        <span class="card-title">角色与权限</span>
        <el-button type="primary" size="small" style="margin-left:auto" @click="openAdd">新增角色</el-button>
      </div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column prop="name" label="角色名称" width="140" />
        <el-table-column prop="code" label="编码" width="120" />
        <el-table-column label="权限" min-width="320">
          <template #default="{ row }">
            <el-tag v-for="p in row.permissions" :key="p" size="small" effect="plain" style="margin:2px">{{ permLabel(p) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="说明" min-width="160" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === 'enabled' ? 'success' : 'info'" effect="light">{{ row.status === 'enabled' ? '启用' : '停用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialog.show" :title="dialog.edit ? '编辑角色' : '新增角色'" width="560px">
      <el-form label-width="90px">
        <el-form-item label="角色名称"><el-input v-model="dialog.form.name" /></el-form-item>
        <el-form-item label="角色编码"><el-input v-model="dialog.form.code" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="dialog.form.desc" /></el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="dialog.form.permissions">
            <el-checkbox v-for="p in ALL_PERMS" :key="p.key" :value="p.key">{{ p.label }}</el-checkbox>
          </el-checkbox-group>
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
