<script setup>
// 充值套餐管理
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRechargePackages,
  createRechargePackage,
  updateRechargePackage,
  deleteRechargePackage
} from '@/api'

const list = ref([])
onMounted(async () => {
  list.value = await getRechargePackages()
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增套餐')
const formRef = ref()
const form = reactive({ id: null, name: '', amount: 0, gift: 0, desc: '', tag: '' })
const rules = {
  name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入充值金额', trigger: 'blur' }]
}

function openAdd() {
  dialogTitle.value = '新增套餐'
  Object.assign(form, { id: null, name: '', amount: 0, gift: 0, desc: '', tag: '' })
  dialogVisible.value = true
}
function openEdit(row) {
  dialogTitle.value = '编辑套餐'
  Object.assign(form, { ...row })
  dialogVisible.value = true
}
async function submit() {
  await formRef.value.validate()
  const payload = { name: form.name, amount: Number(form.amount), gift: Number(form.gift), desc: form.desc, tag: form.tag }
  if (form.id) {
    const updated = await updateRechargePackage(form.id, payload)
    const idx = list.value.findIndex((p) => p.id === form.id)
    if (idx > -1) list.value[idx] = updated
    ElMessage.success('修改成功')
  } else {
    const created = await createRechargePackage(payload)
    list.value.unshift(created)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}
async function toggle(row) {
  await updateRechargePackage(row.id, { enabled: row.enabled })
  ElMessage.success(`「${row.name}」已${row.enabled ? '上架' : '下架'}`)
}
function remove(row) {
  ElMessageBox.confirm(`确定删除「${row.name}」？`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteRechargePackage(row.id)
      list.value = list.value.filter((p) => p.id !== row.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <div class="head-bar">
      <h3 class="title">充值套餐</h3>
      <el-button type="primary" @click="openAdd"><el-icon><Plus /></el-icon>新增套餐</el-button>
    </div>

    <el-row :gutter="16">
      <el-col v-for="pkg in list" :key="pkg.id" :xs="24" :sm="12" :lg="8" :xl="6">
        <div class="pkg-card" :class="{ disabled: !pkg.enabled }">
          <div v-if="pkg.tag" class="corner">{{ pkg.tag }}</div>
          <div class="pkg-name">{{ pkg.name }}</div>
          <div class="pkg-amount">¥<span class="num">{{ pkg.amount }}</span></div>
          <div class="pkg-gift" v-if="pkg.gift">充 {{ pkg.amount }} 送 {{ pkg.gift }} 元</div>
          <div class="pkg-gift placeholder" v-else>无赠送</div>
          <div class="pkg-desc">{{ pkg.desc }}</div>
          <div class="pkg-foot">
            <span class="sales">已售 {{ pkg.sales }}</span>
            <el-switch v-model="pkg.enabled" @change="toggle(pkg)" />
          </div>
          <div class="pkg-ops">
            <el-button text type="primary" @click="openEdit(pkg)">编辑</el-button>
            <el-button text type="danger" @click="remove(pkg)">删除</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="460px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="套餐名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="充值金额" prop="amount"><el-input-number v-model="form.amount" :min="0" :step="10" style="width:100%" /></el-form-item>
        <el-form-item label="赠送金额"><el-input-number v-model="form.gift" :min="0" :step="10" style="width:100%" /></el-form-item>
        <el-form-item label="角标"><el-input v-model="form.tag" placeholder="如：热销/推荐/超值" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.head-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.title { margin: 0; color: #303133; }
.pkg-card {
  position: relative; background: #fff; border-radius: 12px; padding: 22px 20px 14px;
  margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); overflow: hidden;
  border: 1px solid #f0f2f5; transition: transform 0.25s, box-shadow 0.25s;
}
.pkg-card:hover { transform: translateY(-4px); box-shadow: 0 10px 26px rgba(58, 142, 246, 0.16); }
.pkg-card.disabled { opacity: 0.55; }
.corner { position: absolute; top: 14px; right: -28px; transform: rotate(40deg); background: linear-gradient(135deg, #ff7a45, #ff4d4f); color: #fff; font-size: 12px; padding: 3px 34px; }
.pkg-name { font-size: 15px; font-weight: 600; color: #303133; }
.pkg-amount { color: #ff4d4f; font-weight: 600; margin: 10px 0 4px; }
.pkg-amount .num { font-size: 34px; }
.pkg-gift { display: inline-block; background: #fff4e6; color: #fa8c16; font-size: 12px; padding: 2px 10px; border-radius: 10px; }
.pkg-gift.placeholder { background: #f5f7fa; color: #c0c4cc; }
.pkg-desc { color: #909399; font-size: 12px; margin: 12px 0; min-height: 32px; line-height: 1.6; }
.pkg-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #f5f7fa; }
.sales { color: #909399; font-size: 12px; }
.pkg-ops { display: flex; justify-content: flex-end; margin-top: 4px; }
</style>
