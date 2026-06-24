<script setup>
// 商品管理页面
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductSale
} from '@/api'

// 列表与分类（接口拉取）
const list = ref([])
const categories = ref([])

onMounted(async () => {
  const [products, cats] = await Promise.all([getProducts(), getCategories()])
  list.value = products
  categories.value = cats
})

// 筛选条件
const filters = reactive({ keyword: '', categoryId: '', onSale: '' })
const query = reactive({ keyword: '', categoryId: '', onSale: '' })

// 分页
const page = ref(1)
const size = ref(8)

// 过滤后的数据
const filtered = computed(() => {
  return list.value.filter((p) => {
    if (query.keyword && !p.name.includes(query.keyword)) return false
    if (query.categoryId !== '' && p.categoryId !== query.categoryId) return false
    if (query.onSale !== '' && p.onSale !== query.onSale) return false
    return true
  })
})

// 当前页数据（本地切片）
const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

// 查询 / 重置
function handleSearch() {
  query.keyword = filters.keyword
  query.categoryId = filters.categoryId
  query.onSale = filters.onSale
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.categoryId = ''
  filters.onSale = ''
  handleSearch()
}

// 上架状态切换
async function handleToggleSale(row) {
  await setProductSale(row.id, row.onSale)
  ElMessage.success(`「${row.name}」已${row.onSale ? '上架' : '下架'}`)
}

// 编辑 / 新增 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增商品')
const formRef = ref()
const form = reactive({ id: null, name: '', categoryId: '', price: 0, stock: 0, sort: 0 })
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

function openAdd() {
  dialogTitle.value = '新增商品'
  Object.assign(form, { id: null, name: '', categoryId: '', price: 0, stock: 0, sort: 0 })
  dialogVisible.value = true
}
function openEdit(row) {
  dialogTitle.value = '编辑商品'
  Object.assign(form, { id: row.id, name: row.name, categoryId: row.categoryId, price: row.price, stock: row.stock, sort: row.sort })
  dialogVisible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  const payload = {
    name: form.name,
    categoryId: form.categoryId,
    price: Number(form.price),
    stock: Number(form.stock),
    sort: Number(form.sort)
  }
  if (form.id) {
    const updated = await updateProduct(form.id, payload)
    const idx = list.value.findIndex((p) => p.id === form.id)
    if (idx > -1) list.value[idx] = updated
    ElMessage.success('修改成功')
  } else {
    const created = await createProduct({ ...payload, originPrice: Number(form.price) })
    list.value.unshift(created)
    page.value = 1
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

// 删除
function handleDelete(row) {
  ElMessageBox.confirm(`确定删除商品「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      await deleteProduct(row.id)
      list.value = list.value.filter((p) => p.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="商品名称">
          <el-input v-model="filters.keyword" placeholder="请输入商品名称" clearable style="width: 200px" @keyup.enter="handleSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="filters.categoryId" placeholder="全部分类" clearable style="width: 160px">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="filters.onSale" placeholder="全部" clearable style="width: 120px">
            <el-option label="在售" :value="true" />
            <el-option label="已下架" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="add-btn" @click="openAdd"><el-icon><Plus /></el-icon>新增商品</el-button>
    </div>

    <!-- 商品表格 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column label="商品" min-width="280">
          <template #default="{ row }">
            <div class="goods-cell">
              <div class="goods-img" :style="{ background: row.image }">
                <el-icon><Goods /></el-icon>
              </div>
              <span class="goods-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="130" />
        <el-table-column label="价格" width="140">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
            <span v-if="row.originPrice > row.price" class="origin-price">¥{{ row.originPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="90" sortable />
        <el-table-column prop="sales" label="销量" width="90" sortable />
        <el-table-column label="上架状态" width="110">
          <template #default="{ row }">
            <el-switch v-model="row.onSale" @change="handleToggleSale(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          :page-size="size"
          :total="filtered.length"
          layout="total, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 编辑/新增 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
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
  align-items: flex-start;
  flex-wrap: wrap;
}
.add-btn {
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  border: none;
}
.goods-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.goods-img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(58, 142, 246, 0.25);
}
.goods-name {
  font-size: 13px;
  color: #303133;
  line-height: 1.4;
}
.price {
  color: #ff4d4f;
  font-weight: 600;
}
.origin-price {
  margin-left: 6px;
  color: #b0b3b8;
  font-size: 12px;
  text-decoration: line-through;
}
</style>
