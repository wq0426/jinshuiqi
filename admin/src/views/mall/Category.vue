<script setup>
// 商品分类管理页面
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api'

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getCategories()
})

// 编辑/新增 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref()
const form = reactive({ id: null, name: '', sort: 0 })
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

function openAdd() {
  dialogTitle.value = '新增分类'
  Object.assign(form, { id: null, name: '', sort: list.value.length + 1 })
  dialogVisible.value = true
}
function openEdit(row) {
  dialogTitle.value = '编辑分类'
  Object.assign(form, { id: row.id, name: row.name, sort: row.sort })
  dialogVisible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  const payload = { name: form.name, sort: Number(form.sort) }
  if (form.id) {
    const updated = await updateCategory(form.id, payload)
    const idx = list.value.findIndex((c) => c.id === form.id)
    if (idx > -1) list.value[idx] = updated
    ElMessage.success('修改成功')
  } else {
    const created = await createCategory(payload)
    list.value.push(created)
    ElMessage.success('新增成功')
  }
  // 按排序展示
  list.value.sort((a, b) => a.sort - b.sort)
  dialogVisible.value = false
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定删除分类「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      await deleteCategory(row.id)
      list.value = list.value.filter((c) => c.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <span class="bar-title gradient-text">商品分类</span>
      <el-button type="primary" class="add-btn" @click="openAdd"><el-icon><Plus /></el-icon>新增分类</el-button>
    </div>

    <div class="table-card">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column label="分类名称" min-width="220">
          <template #default="{ row }">
            <div class="cat-cell">
              <div class="cat-dot"><el-icon><FolderOpened /></el-icon></div>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="120" sortable />
        <el-table-column label="商品数量" width="140">
          <template #default="{ row }">
            <el-tag type="info" effect="plain">{{ row.count }} 件</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑/新增 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bar-title {
  font-size: 18px;
  font-weight: 700;
}
.add-btn {
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  border: none;
}
.cat-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cat-dot {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
}
</style>
