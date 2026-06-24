<script setup>
// 商城-套餐管理（组合套餐）
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPackages, createPackage, updatePackage, deletePackage } from '@/api'

const list = ref([])
async function load() { list.value = await getPackages() }
onMounted(load)

const dialog = reactive({ show: false, edit: false, form: {}, itemsText: '' })
function openAdd() {
  dialog.edit = false
  dialog.form = { name: '', items: [], price: 0, originPrice: 0, status: 'enabled', desc: '' }
  dialog.itemsText = ''
  dialog.show = true
}
function openEdit(row) {
  dialog.edit = true
  dialog.form = { ...row }
  dialog.itemsText = (row.items || []).join('\n')
  dialog.show = true
}
async function submit() {
  if (!dialog.form.name) return ElMessage.warning('请填写套餐名称')
  dialog.form.items = dialog.itemsText.split('\n').map((s) => s.trim()).filter(Boolean)
  if (dialog.edit) await updatePackage(dialog.form.id, dialog.form)
  else await createPackage(dialog.form)
  dialog.show = false; ElMessage.success('保存成功'); load()
}
async function remove(row) {
  await ElMessageBox.confirm(`确定删除套餐「${row.name}」？`, '提示', { type: 'warning' })
  await deletePackage(row.id); ElMessage.success('已删除'); load()
}
async function toggle(row) {
  await updatePackage(row.id, { ...row, status: row.status === 'enabled' ? 'disabled' : 'enabled' }); load()
}
</script>

<template>
  <div class="page-container">
    <div class="table-card">
      <div class="card-head">
        <span class="card-title">商品组合套餐</span>
        <el-button type="primary" size="small" style="margin-left:auto" @click="openAdd">新增套餐</el-button>
      </div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column prop="name" label="套餐名称" min-width="200" />
        <el-table-column label="包含商品" min-width="240">
          <template #default="{ row }">
            <el-tag v-for="(it, i) in row.items" :key="i" size="small" effect="plain" style="margin:2px">{{ it }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="套餐价" width="110">
          <template #default="{ row }"><span class="amount">¥{{ row.price }}</span></template>
        </el-table-column>
        <el-table-column label="原价" width="100">
          <template #default="{ row }"><span class="origin">¥{{ row.originPrice }}</span></template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="90" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === 'enabled' ? 'success' : 'info'" effect="light">{{ row.status === 'enabled' ? '上架' : '下架' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link :type="row.status === 'enabled' ? 'warning' : 'success'" @click="toggle(row)">{{ row.status === 'enabled' ? '下架' : '上架' }}</el-button>
            <el-button link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialog.show" :title="dialog.edit ? '编辑套餐' : '新增套餐'" width="520px">
      <el-form label-width="90px">
        <el-form-item label="套餐名称"><el-input v-model="dialog.form.name" /></el-form-item>
        <el-form-item label="包含商品"><el-input v-model="dialog.itemsText" type="textarea" :rows="4" placeholder="每行一项，如：JSQ-R600 整机 ×1" /></el-form-item>
        <el-form-item label="套餐价"><el-input-number v-model="dialog.form.price" :min="0" /></el-form-item>
        <el-form-item label="原价"><el-input-number v-model="dialog.form.originPrice" :min="0" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="dialog.form.desc" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dialog.form.status">
            <el-radio value="enabled">上架</el-radio>
            <el-radio value="disabled">下架</el-radio>
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
.amount { color: #ff4d4f; font-weight: 600; }
.origin { color: #bbb; text-decoration: line-through; }
</style>
