<script setup>
// 分销员列表
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDistributors } from '@/api'
import { distributorLevelColor } from '@/constants'

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getDistributors()
})

const levelOptions = ['普通', '会员', '合伙人']

// 筛选
const filters = reactive({ keyword: '', level: '' })
const query = reactive({ keyword: '', level: '' })

// 分页
const page = ref(1)
const size = ref(8)

const filtered = computed(() =>
  list.value.filter((d) => {
    if (query.keyword) {
      const kw = query.keyword
      if (!d.name.includes(kw) && !d.phone.includes(kw)) return false
    }
    if (query.level && d.level !== query.level) return false
    return true
  })
)

const paged = computed(() => {
  const start = (page.value - 1) * size.value
  return filtered.value.slice(start, start + size.value)
})

function handleSearch() {
  query.keyword = filters.keyword
  query.level = filters.level
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.level = ''
  handleSearch()
}

// 查看详情
const dialogVisible = ref(false)
const current = ref(null)
function openView(row) {
  current.value = row
  dialogVisible.value = true
}
function handleEdit(row) {
  ElMessage.info(`编辑分销员：${row.name}`)
}
</script>

<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="姓名 / 手机号" clearable style="width: 200px" @keyup.enter="handleSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="filters.level" placeholder="全部等级" clearable style="width: 140px">
            <el-option v-for="l in levelOptions" :key="l" :label="l" :value="l" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column label="分销员" min-width="150">
          <template #default="{ row }">
            <div class="cust-name">{{ row.name }}</div>
            <div class="cust-phone">{{ row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="distributorLevelColor[row.level]" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parent" label="上级" width="110" />
        <el-table-column prop="teamSize" label="团队规模" width="100" align="center" />
        <el-table-column prop="directCount" label="直推人数" width="100" align="center" />
        <el-table-column label="累计佣金" width="130" align="right">
          <template #default="{ row }"><span class="amount">¥{{ row.totalCommission }}</span></template>
        </el-table-column>
        <el-table-column label="本月佣金" width="130" align="right">
          <template #default="{ row }">¥{{ row.monthCommission }}</template>
        </el-table-column>
        <el-table-column prop="joinDate" label="加入时间" width="120" />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openView(row)"><el-icon><View /></el-icon>查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="分销员详情" width="520px">
      <div v-if="current" class="detail">
        <div class="detail-head">
          <div class="d-avatar"><el-icon :size="26"><Avatar /></el-icon></div>
          <div>
            <div class="d-name">{{ current.name }}</div>
            <div class="d-phone">{{ current.phone }}</div>
          </div>
          <el-tag :type="distributorLevelColor[current.level]" effect="dark" size="large" style="margin-left: auto">
            {{ current.level }}
          </el-tag>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="上级">{{ current.parent }}</el-descriptions-item>
          <el-descriptions-item label="加入时间">{{ current.joinDate }}</el-descriptions-item>
          <el-descriptions-item label="团队规模">{{ current.teamSize }} 人</el-descriptions-item>
          <el-descriptions-item label="直推人数">{{ current.directCount }} 人</el-descriptions-item>
          <el-descriptions-item label="累计佣金">
            <span class="amount">¥{{ current.totalCommission }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="本月佣金">¥{{ current.monthCommission }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.cust-name {
  color: #303133;
  font-weight: 500;
}
.cust-phone {
  color: #909399;
  font-size: 12px;
}
.amount {
  color: #ff4d4f;
  font-weight: 600;
}
.detail-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  margin-bottom: 18px;
}
.d-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}
.d-name {
  font-size: 17px;
  font-weight: 600;
}
.d-phone {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}
</style>
