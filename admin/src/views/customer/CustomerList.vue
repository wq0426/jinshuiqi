<script setup>
// 客户列表页面
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCustomers } from '@/api'
import { customerLevelColor } from '@/constants'
import StatCard from '@/components/StatCard.vue'

const router = useRouter()

// 列表（接口拉取）
const list = ref([])
onMounted(async () => {
  list.value = await getCustomers()
})

// 等级 / 区域 选项
const levels = ['普通', '会员', '合伙人']
const areas = computed(() => Array.from(new Set(list.value.map((c) => c.area))))

// 顶部指标
const statCards = computed(() => [
  {
    label: '客户总数',
    value: list.value.length,
    icon: 'User',
    gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)'
  },
  {
    label: '会员数',
    value: list.value.filter((c) => c.level === '会员').length,
    icon: 'Medal',
    gradient: 'linear-gradient(135deg,#faad14,#ffd666)'
  },
  {
    label: '合伙人',
    value: list.value.filter((c) => c.level === '合伙人').length,
    icon: 'Connection',
    gradient: 'linear-gradient(135deg,#52c41a,#95de64)'
  },
  {
    label: '本月活跃',
    value: list.value.filter((c) => c.lastActive >= '2026-06-01').length,
    icon: 'TrendCharts',
    gradient: 'linear-gradient(135deg,#9254de,#b37feb)'
  }
])

// 筛选条件
const filters = reactive({ keyword: '', level: '', area: '' })
const query = reactive({ keyword: '', level: '', area: '' })

// 分页
const page = ref(1)
const size = ref(8)

const filtered = computed(() =>
  list.value.filter((c) => {
    if (query.keyword) {
      const kw = query.keyword
      if (!c.name.includes(kw) && !c.phone.includes(kw) && !c.nickname.includes(kw)) return false
    }
    if (query.level && c.level !== query.level) return false
    if (query.area && c.area !== query.area) return false
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
  query.area = filters.area
  page.value = 1
}
function handleReset() {
  filters.keyword = ''
  filters.level = ''
  filters.area = ''
  handleSearch()
}

function openDetail(row) {
  router.push('/customer/detail/' + row.id)
}
</script>

<template>
  <div class="page-container">
    <!-- 顶部指标 -->
    <el-row :gutter="16">
      <el-col v-for="card in statCards" :key="card.label" :xs="12" :sm="12" :lg="6">
        <StatCard v-bind="card" style="margin-bottom: 16px" />
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            placeholder="姓名 / 手机 / 昵称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="分销等级">
          <el-select v-model="filters.level" placeholder="全部等级" clearable style="width: 130px">
            <el-option v-for="l in levels" :key="l" :label="l" :value="l" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="filters.area" placeholder="全部区域" clearable style="width: 180px">
            <el-option v-for="a in areas" :key="a" :label="a" :value="a" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 客户表格 -->
    <div class="table-card">
      <el-table :data="paged" stripe style="width: 100%">
        <el-table-column label="客户" min-width="180">
          <template #default="{ row }">
            <div class="cust-cell">
              <el-avatar :size="38" class="cust-avatar">{{ row.name.charAt(0) }}</el-avatar>
              <div class="cust-info">
                <div class="cust-nick">{{ row.nickname }}</div>
                <div class="cust-real">{{ row.name }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机" width="130" />
        <el-table-column prop="area" label="区域" min-width="150" show-overflow-tooltip />
        <el-table-column label="余额" width="110">
          <template #default="{ row }">
            <span class="money">¥{{ row.balance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="90" />
        <el-table-column label="分销等级" width="100">
          <template #default="{ row }">
            <el-tag :type="customerLevelColor[row.level]" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceCount" label="设备数" width="80" align="center" />
        <el-table-column prop="orderCount" label="订单数" width="80" align="center" />
        <el-table-column prop="registerDate" label="注册时间" width="120" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)"><el-icon><View /></el-icon>详情</el-button>
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
  </div>
</template>

<style scoped>
.cust-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cust-avatar {
  background: linear-gradient(135deg, #3a8ef6, #26c6da);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.cust-nick {
  color: #303133;
  font-weight: 500;
}
.cust-real {
  color: #909399;
  font-size: 12px;
}
.money {
  color: #ff4d4f;
  font-weight: 600;
}
</style>
