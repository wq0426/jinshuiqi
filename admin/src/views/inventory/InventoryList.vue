<script setup>
// 库存管理：库存列表 + 出入库 + 出入库记录
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getInventory, createInventory, updateInventory, deleteInventory,
  getStockLogs, stockInOut, exportCsv
} from '@/api'

const tab = ref('stock')
const list = ref([])
const logs = ref([])
async function loadStock() { list.value = await getInventory() }
async function loadLogs() { logs.value = await getStockLogs() }
onMounted(() => { loadStock(); loadLogs() })

const warnCount = computed(() => list.value.filter((r) => r.stock <= r.warnLine).length)

const dialog = reactive({ show: false, edit: false, form: {} })
function openAdd() {
  dialog.edit = false
  dialog.form = { name: '', sku: '', model: '', category: '', stock: 0, warnLine: 0, location: '', unit: '件' }
  dialog.show = true
}
function openEdit(row) { dialog.edit = true; dialog.form = { ...row }; dialog.show = true }
async function submit() {
  if (!dialog.form.name || !dialog.form.sku) return ElMessage.warning('请填写名称和 SKU')
  if (dialog.edit) await updateInventory(dialog.form.id, dialog.form)
  else await createInventory(dialog.form)
  dialog.show = false; ElMessage.success('保存成功'); loadStock()
}
async function remove(row) {
  await ElMessageBox.confirm(`确定删除「${row.name}」？`, '提示', { type: 'warning' })
  await deleteInventory(row.id); ElMessage.success('已删除'); loadStock()
}

const io = reactive({ show: false, type: 'in', form: {} })
function openIO(type) {
  io.type = type
  io.form = { sku: '', qty: 1, operator: '管理员', remark: '' }
  io.show = true
}
async function submitIO() {
  if (!io.form.sku) return ElMessage.warning('请选择商品')
  await stockInOut({ ...io.form, type: io.type })
  io.show = false; ElMessage.success(io.type === 'in' ? '入库成功' : '出库成功')
  loadStock(); loadLogs()
}
function doExport() {
  exportCsv('库存清单', [
    { prop: 'name', label: '名称' }, { prop: 'sku', label: 'SKU' },
    { prop: 'model', label: '型号' }, { prop: 'category', label: '分类' },
    { prop: 'stock', label: '库存' }, { prop: 'warnLine', label: '预警线' },
    { prop: 'location', label: '库位' }, { prop: 'updateTime', label: '更新时间' }
  ], list.value)
}
</script>

<template>
  <div class="page-container">
    <el-tabs v-model="tab" class="app-card" style="padding:8px 16px">
      <el-tab-pane label="库存清单" name="stock">
        <div class="bar">
          <el-button type="primary" @click="openAdd">新增库存</el-button>
          <el-button type="success" @click="openIO('in')">入库</el-button>
          <el-button type="warning" @click="openIO('out')">出库</el-button>
          <el-button @click="doExport">导出 CSV</el-button>
          <el-tag v-if="warnCount" type="danger" effect="light" style="margin-left:auto">{{ warnCount }} 项低于预警线</el-tag>
        </div>
        <el-table :data="list" stripe style="width:100%">
          <el-table-column prop="name" label="名称" min-width="160" />
          <el-table-column prop="sku" label="SKU" width="120" />
          <el-table-column prop="model" label="型号" width="120" />
          <el-table-column prop="category" label="分类" width="110" />
          <el-table-column label="库存" width="110">
            <template #default="{ row }">
              <span :style="{ color: row.stock <= row.warnLine ? '#ff4d4f' : '#303133', fontWeight: 600 }">{{ row.stock }} {{ row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warnLine" label="预警线" width="90" />
          <el-table-column prop="location" label="库位" width="120" />
          <el-table-column prop="updateTime" label="更新时间" min-width="150" />
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="出入库记录" name="logs">
        <el-table :data="logs" stripe style="width:100%">
          <el-table-column prop="id" label="单号" width="160" />
          <el-table-column prop="sku" label="SKU" width="120" />
          <el-table-column prop="name" label="名称" min-width="160" />
          <el-table-column label="类型" width="90">
            <template #default="{ row }"><el-tag :type="row.type === 'in' ? 'success' : 'warning'" effect="light">{{ row.type === 'in' ? '入库' : '出库' }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="qty" label="数量" width="90" />
          <el-table-column prop="operator" label="操作人" width="120" />
          <el-table-column prop="remark" label="备注" min-width="140" />
          <el-table-column prop="time" label="时间" min-width="150" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialog.show" :title="dialog.edit ? '编辑库存' : '新增库存'" width="480px">
      <el-form label-width="80px">
        <el-form-item label="名称"><el-input v-model="dialog.form.name" /></el-form-item>
        <el-form-item label="SKU"><el-input v-model="dialog.form.sku" /></el-form-item>
        <el-form-item label="型号"><el-input v-model="dialog.form.model" /></el-form-item>
        <el-form-item label="分类"><el-input v-model="dialog.form.category" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="dialog.form.stock" :min="0" /></el-form-item>
        <el-form-item label="预警线"><el-input-number v-model="dialog.form.warnLine" :min="0" /></el-form-item>
        <el-form-item label="单位"><el-input v-model="dialog.form.unit" style="width:120px" /></el-form-item>
        <el-form-item label="库位"><el-input v-model="dialog.form.location" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="io.show" :title="io.type === 'in' ? '入库' : '出库'" width="420px">
      <el-form label-width="80px">
        <el-form-item label="商品">
          <el-select v-model="io.form.sku" placeholder="选择商品" style="width:100%">
            <el-option v-for="it in list" :key="it.sku" :label="`${it.name}（${it.sku}）`" :value="it.sku" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量"><el-input-number v-model="io.form.qty" :min="1" /></el-form-item>
        <el-form-item label="操作人"><el-input v-model="io.form.operator" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="io.form.remark" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="io.show = false">取消</el-button>
        <el-button type="primary" @click="submitIO">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.bar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
</style>
