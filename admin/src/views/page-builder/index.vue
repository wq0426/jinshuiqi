<script setup>
// 页面装修 / 前端页面自定义 —— 三栏可视化装修器
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPageConfig, savePageConfig } from '@/api'

// 左侧组件库
const widgets = [
  { type: 'banner', name: '轮播图', icon: 'Picture' },
  { type: 'nav', name: '金刚区', icon: 'Grid' },
  { type: 'goods', name: '商品组', icon: 'Goods' },
  { type: 'notice', name: '公告栏', icon: 'Bell' },
  { type: 'image', name: '图文', icon: 'PictureFilled' },
  { type: 'coupon', name: '优惠券', icon: 'Ticket' },
  { type: 'service', name: '服务入口', icon: 'Tools' },
  { type: 'title', name: '标题栏', icon: 'Memo' }
]

// 默认属性
function defaultProps(type) {
  switch (type) {
    case 'banner': return { images: ['蓝色海报', '青色海报', '橙色海报'], height: 150 }
    case 'nav': return { cols: 4, items: ['商城', '装机预约', '我的设备', '分销中心', '充值', '维修', '水质检测', '全部'] }
    case 'goods': return { title: '推荐商品', cols: 2, count: 4 }
    case 'notice': return { text: '欢迎使用净水管家，新装机用户立享 8 折优惠！' }
    case 'image': return { text: '图文广告位', height: 120 }
    case 'coupon': return { count: 3 }
    case 'service': return { items: ['装机', '拆机', '迁机', '维修'] }
    case 'title': return { text: '版块标题', sub: '副标题描述' }
    default: return {}
  }
}

let uid = 1
const canvas = ref([
  { id: uid++, type: 'banner', props: defaultProps('banner') },
  { id: uid++, type: 'nav', props: defaultProps('nav') },
  { id: uid++, type: 'goods', props: defaultProps('goods') }
])
const selectedId = ref(canvas.value[0].id)

const selected = computed(() => canvas.value.find((c) => c.id === selectedId.value))

// 页面全局设置
const pageConfig = ref({ title: '净水管家首页', bgColor: '#f5f7fa' })

// 加载已保存的装修配置
onMounted(async () => {
  const data = await getPageConfig()
  if (data?.components?.length) {
    canvas.value = data.components
    uid = Math.max(...data.components.map((c) => c.id)) + 1
    selectedId.value = data.components[0].id
  }
  if (data?.pageConfig) pageConfig.value = data.pageConfig
})

function addWidget(w) {
  const node = { id: uid++, type: w.type, props: defaultProps(w.type) }
  canvas.value.push(node)
  selectedId.value = node.id
  ElMessage.success(`已添加「${w.name}」`)
}
function selectNode(id) { selectedId.value = id }
function moveUp(index) {
  if (index === 0) return
  ;[canvas.value[index - 1], canvas.value[index]] = [canvas.value[index], canvas.value[index - 1]]
}
function moveDown(index) {
  if (index === canvas.value.length - 1) return
  ;[canvas.value[index + 1], canvas.value[index]] = [canvas.value[index], canvas.value[index + 1]]
}
function removeNode(index) {
  const [removed] = canvas.value.splice(index, 1)
  if (removed.id === selectedId.value) selectedId.value = canvas.value[0]?.id ?? null
}
function widgetName(type) { return widgets.find((w) => w.type === type)?.name || type }

async function save() {
  await savePageConfig({ components: canvas.value, pageConfig: pageConfig.value })
  ElMessage.success('页面已保存并发布到小程序')
}
function reset() {
  canvas.value = []
  selectedId.value = null
  ElMessage.info('画布已清空')
}
</script>

<template>
  <div class="builder">
    <!-- 左：组件库 -->
    <div class="panel left">
      <div class="panel-title">组件库</div>
      <div class="widget-grid">
        <div v-for="w in widgets" :key="w.type" class="widget-item" @click="addWidget(w)">
          <el-icon :size="22"><component :is="w.icon" /></el-icon>
          <span>{{ w.name }}</span>
        </div>
      </div>
      <div class="tip">点击组件添加到画布 →</div>
    </div>

    <!-- 中：手机预览 -->
    <div class="panel center">
      <div class="toolbar">
        <span>实时预览</span>
        <div>
          <el-button size="small" @click="reset">清空</el-button>
          <el-button size="small" type="primary" @click="save"><el-icon><Upload /></el-icon>保存并发布</el-button>
        </div>
      </div>
      <div class="phone">
        <div class="phone-notch"></div>
        <div class="phone-status">9:41　净水管家</div>
        <div class="phone-screen" :style="{ background: pageConfig.bgColor }">
          <div v-if="!canvas.length" class="empty">从左侧添加组件开始装修</div>

          <div
            v-for="(node, index) in canvas"
            :key="node.id"
            class="comp"
            :class="{ active: node.id === selectedId }"
            @click="selectNode(node.id)"
          >
            <!-- 轮播图 -->
            <div v-if="node.type === 'banner'" class="c-banner" :style="{ height: node.props.height + 'px' }">
              <span>🖼 {{ node.props.images[0] }}</span>
              <div class="dots"><i v-for="(b, bi) in node.props.images" :key="bi"></i></div>
            </div>
            <!-- 金刚区 -->
            <div v-else-if="node.type === 'nav'" class="c-nav" :style="{ gridTemplateColumns: `repeat(${node.props.cols},1fr)` }">
              <div v-for="(it, ii) in node.props.items" :key="ii" class="nav-cell">
                <div class="nav-ic"></div><span>{{ it }}</span>
              </div>
            </div>
            <!-- 商品组 -->
            <div v-else-if="node.type === 'goods'" class="c-goods">
              <div class="c-goods-title">{{ node.props.title }}</div>
              <div class="goods-grid" :style="{ gridTemplateColumns: `repeat(${node.props.cols},1fr)` }">
                <div v-for="g in node.props.count" :key="g" class="goods-cell">
                  <div class="g-img"></div><div class="g-name">净水器商品{{ g }}</div><div class="g-price">¥1{{ g }}99</div>
                </div>
              </div>
            </div>
            <!-- 公告 -->
            <div v-else-if="node.type === 'notice'" class="c-notice">📢 {{ node.props.text }}</div>
            <!-- 图文 -->
            <div v-else-if="node.type === 'image'" class="c-image" :style="{ height: node.props.height + 'px' }">{{ node.props.text }}</div>
            <!-- 优惠券 -->
            <div v-else-if="node.type === 'coupon'" class="c-coupon">
              <div v-for="c in node.props.count" :key="c" class="coupon"><b>¥{{ c * 10 }}</b><span>满减券</span></div>
            </div>
            <!-- 服务入口 -->
            <div v-else-if="node.type === 'service'" class="c-service">
              <div v-for="(s, si) in node.props.items" :key="si" class="svc">{{ s }}</div>
            </div>
            <!-- 标题 -->
            <div v-else-if="node.type === 'title'" class="c-title"><b>{{ node.props.text }}</b><small>{{ node.props.sub }}</small></div>

            <!-- 选中操作条 -->
            <div v-if="node.id === selectedId" class="comp-ops" @click.stop>
              <el-button-group>
                <el-button size="small" :disabled="index===0" @click="moveUp(index)"><el-icon><Top /></el-icon></el-button>
                <el-button size="small" :disabled="index===canvas.length-1" @click="moveDown(index)"><el-icon><Bottom /></el-icon></el-button>
                <el-button size="small" type="danger" @click="removeNode(index)"><el-icon><Delete /></el-icon></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右：属性配置 -->
    <div class="panel right">
      <div class="panel-title">{{ selected ? widgetName(selected.type) + ' 设置' : '页面设置' }}</div>
      <template v-if="selected">
        <el-form label-position="top" size="small">
          <template v-if="selected.type === 'banner'">
            <el-form-item label="轮播高度(px)"><el-slider v-model="selected.props.height" :min="100" :max="240" /></el-form-item>
            <el-form-item label="图片数量"><el-tag>{{ selected.props.images.length }} 张</el-tag></el-form-item>
          </template>
          <template v-else-if="selected.type === 'nav'">
            <el-form-item label="每行列数"><el-radio-group v-model="selected.props.cols"><el-radio-button :label="3" /><el-radio-button :label="4" /><el-radio-button :label="5" /></el-radio-group></el-form-item>
          </template>
          <template v-else-if="selected.type === 'goods'">
            <el-form-item label="版块标题"><el-input v-model="selected.props.title" /></el-form-item>
            <el-form-item label="每行列数"><el-radio-group v-model="selected.props.cols"><el-radio-button :label="2" /><el-radio-button :label="3" /></el-radio-group></el-form-item>
            <el-form-item label="商品数量"><el-input-number v-model="selected.props.count" :min="2" :max="8" /></el-form-item>
          </template>
          <template v-else-if="selected.type === 'notice'">
            <el-form-item label="公告内容"><el-input v-model="selected.props.text" type="textarea" :rows="3" /></el-form-item>
          </template>
          <template v-else-if="selected.type === 'image'">
            <el-form-item label="占位文字"><el-input v-model="selected.props.text" /></el-form-item>
            <el-form-item label="高度(px)"><el-slider v-model="selected.props.height" :min="60" :max="260" /></el-form-item>
          </template>
          <template v-else-if="selected.type === 'coupon'">
            <el-form-item label="优惠券数量"><el-input-number v-model="selected.props.count" :min="1" :max="4" /></el-form-item>
          </template>
          <template v-else-if="selected.type === 'title'">
            <el-form-item label="主标题"><el-input v-model="selected.props.text" /></el-form-item>
            <el-form-item label="副标题"><el-input v-model="selected.props.sub" /></el-form-item>
          </template>
          <template v-else>
            <el-empty description="该组件无可配置项" :image-size="60" />
          </template>
        </el-form>
      </template>
      <template v-else>
        <el-form label-position="top" size="small">
          <el-form-item label="页面标题"><el-input v-model="pageConfig.title" /></el-form-item>
          <el-form-item label="背景颜色"><el-color-picker v-model="pageConfig.bgColor" /></el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<style scoped>
.builder { display: flex; gap: 14px; height: calc(100vh - 130px); padding: 16px; }
.panel { background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04); overflow-y: auto; }
.panel.left { width: 220px; flex-shrink: 0; padding: 16px; }
.panel.right { width: 280px; flex-shrink: 0; padding: 16px; }
.panel.center { flex: 1; display: flex; flex-direction: column; padding: 0; background: #eef1f6; }
.panel-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 14px; padding-left: 10px; border-left: 3px solid #3a8ef6; }
.widget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.widget-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 6px; border: 1px solid #eef1f6; border-radius: 8px; cursor: pointer; color: #5c6573; transition: all 0.2s; }
.widget-item:hover { border-color: #3a8ef6; color: #3a8ef6; background: #f3f8ff; transform: translateY(-2px); }
.widget-item span { font-size: 12px; }
.tip { margin-top: 16px; color: #c0c4cc; font-size: 12px; text-align: center; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #fff; border-radius: 10px 10px 0 0; font-size: 14px; color: #303133; }
.phone { width: 340px; margin: 18px auto; background: #1f2533; border-radius: 36px; padding: 12px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); position: relative; }
.phone-notch { width: 120px; height: 22px; background: #1f2533; border-radius: 0 0 16px 16px; position: absolute; left: 50%; transform: translateX(-50%); top: 12px; z-index: 2; }
.phone-status { color: #fff; text-align: center; font-size: 12px; padding: 8px 0; }
.phone-screen { height: 560px; border-radius: 26px; overflow-y: auto; padding: 8px; }
.empty { color: #c0c4cc; text-align: center; padding-top: 200px; font-size: 13px; }
.comp { position: relative; margin-bottom: 8px; border: 2px solid transparent; border-radius: 8px; cursor: pointer; }
.comp.active { border-color: #3a8ef6; }
.comp-ops { position: absolute; top: -2px; right: -2px; z-index: 5; }
.c-banner { background: linear-gradient(135deg, #3a8ef6, #26c6da); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; position: relative; }
.c-banner .dots { position: absolute; bottom: 8px; display: flex; gap: 4px; }
.c-banner .dots i { width: 6px; height: 6px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); }
.c-banner .dots i:first-child { width: 14px; border-radius: 3px; background: #fff; }
.c-nav { display: grid; gap: 8px; background: #fff; border-radius: 8px; padding: 12px 8px; }
.nav-cell { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 11px; color: #5c6573; }
.nav-ic { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #e8f3ff, #e0f7fa); }
.c-goods { background: #fff; border-radius: 8px; padding: 10px; }
.c-goods-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #303133; }
.goods-grid { display: grid; gap: 8px; }
.goods-cell { background: #f7f9fc; border-radius: 6px; padding: 6px; }
.g-img { height: 60px; border-radius: 6px; background: linear-gradient(135deg, #dbeafe, #cffafe); margin-bottom: 6px; }
.g-name { font-size: 11px; color: #303133; }
.g-price { font-size: 12px; color: #ff4d4f; font-weight: 600; }
.c-notice { background: #fff7e6; color: #fa8c16; font-size: 12px; padding: 8px 10px; border-radius: 8px; }
.c-image { background: linear-gradient(135deg, #f0f5ff, #e6fffb); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #8c9bb5; font-size: 13px; }
.c-coupon { display: flex; gap: 8px; }
.coupon { flex: 1; background: linear-gradient(135deg, #fff1f0, #ffece8); border-radius: 8px; padding: 10px; text-align: center; color: #ff4d4f; }
.coupon b { display: block; font-size: 18px; }
.coupon span { font-size: 11px; }
.c-service { display: flex; gap: 8px; background: #fff; border-radius: 8px; padding: 12px; }
.svc { flex: 1; text-align: center; background: #f3f8ff; border-radius: 6px; padding: 12px 0; font-size: 12px; color: #3a8ef6; }
.c-title { background: #fff; padding: 10px 12px; border-radius: 8px; }
.c-title b { color: #303133; font-size: 14px; }
.c-title small { color: #909399; margin-left: 8px; }
</style>
