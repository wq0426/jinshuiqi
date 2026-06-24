<script setup>
// 分销-区域分红
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRegionDividends, updateRegionDividend } from '@/api'

const list = ref([])
async function load() { list.value = await getRegionDividends() }
onMounted(load)

const totalMonth = computed(() => list.value.reduce((s, r) => s + r.monthAmount, 0))

const dialog = reactive({ show: false, form: {} })
function openEdit(row) { dialog.form = { ...row }; dialog.show = true }
async function submit() {
  await updateRegionDividend(dialog.form.id, dialog.form)
  dialog.show = false; ElMessage.success('已保存'); load()
}
</script>

<template>
  <div class="page-container">
    <div class="table-card">
      <div class="card-head">
        <span class="card-title">区域分红</span>
        <el-tag type="success" effect="light" style="margin-left:auto">本月分红合计 ¥{{ totalMonth.toLocaleString() }}</el-tag>
      </div>
      <el-table :data="list" stripe style="width:100%">
        <el-table-column prop="region" label="区域" width="120" />
        <el-table-column prop="manager" label="区域负责人" width="130" />
        <el-table-column label="等级" width="100">
          <template #default="{ row }"><el-tag effect="plain">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="memberCount" label="团队人数" width="100" />
        <el-table-column label="分红比例" width="100">
          <template #default="{ row }">{{ row.dividendRate }}%</template>
        </el-table-column>
        <el-table-column label="本月分红" width="130">
          <template #default="{ row }"><span class="amount">¥{{ row.monthAmount.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column label="累计分红" min-width="130">
          <template #default="{ row }">¥{{ row.totalAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">调整</el-button></template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialog.show" title="调整区域分红" width="420px">
      <el-form label-width="100px">
        <el-form-item label="区域"><el-input v-model="dialog.form.region" disabled /></el-form-item>
        <el-form-item label="负责人"><el-input v-model="dialog.form.manager" /></el-form-item>
        <el-form-item label="等级"><el-input v-model="dialog.form.level" /></el-form-item>
        <el-form-item label="分红比例(%)"><el-input-number v-model="dialog.form.dividendRate" :min="0" :max="100" /></el-form-item>
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
</style>
