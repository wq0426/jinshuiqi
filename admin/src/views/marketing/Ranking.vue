<script setup>
// 排行榜激励：销售榜/收益榜 × 个人/团队 × 月/季/年
import { ref, reactive, onMounted, watch } from 'vue'
import { getRankings } from '@/api'

const filters = reactive({ board: 'sales', scope: 'personal', period: 'month' })
const list = ref([])

async function load() {
  list.value = await getRankings({ ...filters })
}
onMounted(load)
watch(filters, load)

const boards = [
  { label: '销售榜', value: 'sales' },
  { label: '收益榜', value: 'profit' }
]
const scopes = [
  { label: '个人', value: 'personal' },
  { label: '团队', value: 'team' }
]
const periods = [
  { label: '月榜', value: 'month' },
  { label: '季度榜', value: 'quarter' },
  { label: '年榜', value: 'year' }
]
const medal = (rank) => ['🥇', '🥈', '🥉'][rank - 1] || rank
const fmtValue = (v) => (filters.board === 'sales' ? `${v} 单` : `¥${Number(v).toLocaleString()}`)
</script>

<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-radio-group v-model="filters.board" style="margin-right:24px">
        <el-radio-button v-for="b in boards" :key="b.value" :value="b.value">{{ b.label }}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="filters.scope" style="margin-right:24px">
        <el-radio-button v-for="s in scopes" :key="s.value" :value="s.value">{{ s.label }}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="filters.period">
        <el-radio-button v-for="p in periods" :key="p.value" :value="p.value">{{ p.label }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="table-card">
      <div class="card-head">
        <span class="card-title">{{ boards.find(b => b.value === filters.board).label }} · {{ scopes.find(s => s.value === filters.scope).label }} · {{ periods.find(p => p.value === filters.period).label }}</span>
      </div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column label="名次" width="90" align="center">
          <template #default="{ row }"><span class="medal">{{ medal(row.rank) }}</span></template>
        </el-table-column>
        <el-table-column label="名称" min-width="160">
          <template #default="{ row }">
            <div class="name-cell">
              <span class="avatar">{{ row.avatar }}</span>{{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="区域" width="120" />
        <el-table-column label="业绩" width="160">
          <template #default="{ row }"><span class="amount">{{ fmtValue(row.value) }}</span></template>
        </el-table-column>
        <el-table-column label="名次变化" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.trend > 0" type="success" effect="light">↑ {{ row.trend }}</el-tag>
            <el-tag v-else-if="row.trend < 0" type="danger" effect="light">↓ {{ -row.trend }}</el-tag>
            <el-tag v-else type="info" effect="light">—</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.card-head { margin-bottom: 14px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; position: relative; padding-left: 12px; }
.card-title::before { content: ''; position: absolute; left: 0; top: 2px; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #3a8ef6, #26c6da); }
.medal { font-size: 18px; font-weight: 700; }
.name-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg,#3A8EF6,#26C6DA); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; }
.amount { color: #ff4d4f; font-weight: 600; }
</style>
