<script setup>
// 设备型号管理页面
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDeviceModels, createDeviceModel, updateDeviceModel, deleteDeviceModel } from '@/api'

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getDeviceModels()
})

// 类型选项
const typeOptions = ['RO反渗透', '管线机', '中央净水', '超滤机', '母婴净水']

// 编辑 / 新增 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增型号')
const formRef = ref()
const form = reactive({ id: null, name: '', type: '', capacity: '', filters: 1, price: 0, status: '在售' })
const rules = {
  name: [{ required: true, message: '请输入型号名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入指导价', trigger: 'blur' }]
}

function openAdd() {
  dialogTitle.value = '新增型号'
  Object.assign(form, { id: null, name: '', type: '', capacity: '', filters: 1, price: 0, status: '在售' })
  dialogVisible.value = true
}
function openEdit(row) {
  dialogTitle.value = '编辑型号'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    type: row.type,
    capacity: row.capacity,
    filters: row.filters,
    price: row.price,
    status: row.status
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  const payload = {
    name: form.name,
    type: form.type,
    capacity: form.capacity || '-',
    filters: Number(form.filters),
    price: Number(form.price),
    status: form.status
  }
  if (form.id) {
    const updated = await updateDeviceModel(form.id, payload)
    const idx = list.value.findIndex((m) => m.id === form.id)
    if (idx > -1) list.value[idx] = updated
    ElMessage.success('修改成功')
  } else {
    const created = await createDeviceModel(payload)
    list.value.unshift(created)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

// 删除
function handleDelete(row) {
  ElMessageBox.confirm(`确定删除型号「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      await deleteDeviceModel(row.id)
      list.value = list.value.filter((m) => m.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <!-- 操作栏 -->
    <div class="filter-bar">
      <div class="bar-title gradient-text">设备型号管理</div>
      <el-button type="primary" class="add-btn" @click="openAdd">
        <el-icon><Plus /></el-icon>新增型号
      </el-button>
    </div>

    <!-- 型号表格 -->
    <div class="table-card">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column label="型号名称" min-width="180">
          <template #default="{ row }">
            <div class="model-cell">
              <div class="model-img">
                <el-icon><Cpu /></el-icon>
              </div>
              <span class="model-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="130" />
        <el-table-column prop="capacity" label="制水量" width="120" />
        <el-table-column label="滤芯级数" width="100" align="center">
          <template #default="{ row }">{{ row.filters }} 级</template>
        </el-table-column>
        <el-table-column label="指导价" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '在售' ? 'success' : 'info'" effect="light">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="装机数量" width="110" align="center" sortable />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑/新增 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="型号名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入型号名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="制水量">
          <el-input v-model="form.capacity" placeholder="如 600G / 2000L/h" />
        </el-form-item>
        <el-form-item label="滤芯级数">
          <el-input-number v-model="form.filters" :min="1" :max="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="指导价" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="0" :step="100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="在售" value="在售" />
            <el-option label="停产" value="停产" />
          </el-select>
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
.model-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.model-img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  box-shadow: 0 2px 8px rgba(58, 142, 246, 0.25);
}
.model-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}
.price {
  color: #ff4d4f;
  font-weight: 600;
}
</style>
