import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const Layout = () => import('@/layout/index.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    // 数据大屏：独立全屏，无侧边栏
    path: '/data-screen',
    name: 'DataScreen',
    component: () => import('@/views/data/DataScreen.vue'),
    meta: { title: '数据大屏' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台', icon: 'Odometer' }
      },
      // 数据中心
      {
        path: 'data/install',
        name: 'DataInstall',
        component: () => import('@/views/data/InstallData.vue'),
        meta: { title: '装机数据', icon: 'TrendCharts' }
      },
      {
        path: 'data/recharge',
        name: 'DataRecharge',
        component: () => import('@/views/data/RechargeData.vue'),
        meta: { title: '充值数据', icon: 'TrendCharts' }
      },
      {
        path: 'data/customer',
        name: 'DataCustomer',
        component: () => import('@/views/data/CustomerData.vue'),
        meta: { title: '客户数据', icon: 'TrendCharts' }
      },
      // 商城管理
      {
        path: 'mall/products',
        name: 'MallProducts',
        component: () => import('@/views/mall/Products.vue'),
        meta: { title: '商品列表', icon: 'Goods' }
      },
      {
        path: 'mall/category',
        name: 'MallCategory',
        component: () => import('@/views/mall/Category.vue'),
        meta: { title: '商品分类', icon: 'Menu' }
      },
      {
        path: 'mall/orders',
        name: 'MallOrders',
        component: () => import('@/views/mall/Orders.vue'),
        meta: { title: '订单管理', icon: 'List' }
      },
      // 设备管理
      {
        path: 'device/list',
        name: 'DeviceList',
        component: () => import('@/views/device/DeviceList.vue'),
        meta: { title: '设备列表', icon: 'Cpu' }
      },
      {
        path: 'device/detail/:id',
        name: 'DeviceDetail',
        component: () => import('@/views/device/DeviceDetail.vue'),
        meta: { title: '设备详情', icon: 'Cpu', hidden: true }
      },
      {
        path: 'device/models',
        name: 'DeviceModels',
        component: () => import('@/views/device/DeviceModels.vue'),
        meta: { title: '设备型号', icon: 'SetUp' }
      },
      // 服务工单
      {
        path: 'workorder/list',
        name: 'WorkorderList',
        component: () => import('@/views/workorder/WorkorderList.vue'),
        meta: { title: '工单列表', icon: 'Tickets' }
      },
      {
        path: 'workorder/dispatch',
        name: 'WorkorderDispatch',
        component: () => import('@/views/workorder/Dispatch.vue'),
        meta: { title: '派单', icon: 'Promotion' }
      },
      {
        path: 'workorder/detail/:id',
        name: 'WorkorderDetail',
        component: () => import('@/views/workorder/WorkorderDetail.vue'),
        meta: { title: '工单详情', icon: 'Document', hidden: true }
      },
      {
        path: 'workorder/technicians',
        name: 'Technicians',
        component: () => import('@/views/workorder/Technicians.vue'),
        meta: { title: '师傅管理', icon: 'Avatar' }
      },
      // 分销管理
      {
        path: 'distribution/overview',
        name: 'DistOverview',
        component: () => import('@/views/distribution/Overview.vue'),
        meta: { title: '分销概览', icon: 'Share' }
      },
      {
        path: 'distribution/members',
        name: 'DistMembers',
        component: () => import('@/views/distribution/Members.vue'),
        meta: { title: '分销员', icon: 'UserFilled' }
      },
      {
        path: 'distribution/commission',
        name: 'DistCommission',
        component: () => import('@/views/distribution/Commission.vue'),
        meta: { title: '佣金记录', icon: 'Money' }
      },
      {
        path: 'distribution/withdraw',
        name: 'DistWithdraw',
        component: () => import('@/views/distribution/Withdraw.vue'),
        meta: { title: '提现审核', icon: 'Wallet' }
      },
      {
        path: 'distribution/rules',
        name: 'DistRules',
        component: () => import('@/views/distribution/Rules.vue'),
        meta: { title: '分润规则', icon: 'SetUp' }
      },
      // 客户管理
      {
        path: 'customer/list',
        name: 'CustomerList',
        component: () => import('@/views/customer/CustomerList.vue'),
        meta: { title: '客户列表', icon: 'User' }
      },
      {
        path: 'customer/detail/:id',
        name: 'CustomerDetail',
        component: () => import('@/views/customer/CustomerDetail.vue'),
        meta: { title: '客户详情', icon: 'User', hidden: true }
      },
      // 充值管理
      {
        path: 'recharge/packages',
        name: 'RechargePackages',
        component: () => import('@/views/recharge/Packages.vue'),
        meta: { title: '充值套餐', icon: 'CreditCard' }
      },
      {
        path: 'recharge/records',
        name: 'RechargeRecords',
        component: () => import('@/views/recharge/Records.vue'),
        meta: { title: '充值记录', icon: 'Tickets' }
      },
      // 页面装修
      {
        path: 'page-builder',
        name: 'PageBuilder',
        component: () => import('@/views/page-builder/index.vue'),
        meta: { title: '页面装修', icon: 'Brush' }
      },
      // 预警管理
      {
        path: 'alert/list',
        name: 'AlertList',
        component: () => import('@/views/alert/AlertList.vue'),
        meta: { title: '预警列表', icon: 'Warning' }
      },
      {
        path: 'alert/rules',
        name: 'AlertRules',
        component: () => import('@/views/alert/AlertRules.vue'),
        meta: { title: '预警规则', icon: 'SetUp' }
      },
      // 系统设置
      {
        path: 'system/settings',
        name: 'SystemSettings',
        component: () => import('@/views/system/Settings.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      },
      // ===== 补齐脑图功能的新增路由 =====
      { path: 'data/renewal', name: 'DataRenewal', component: () => import('@/views/data/RenewalData.vue'), meta: { title: '续费数据' } },
      { path: 'mall/packages', name: 'MallPackages', component: () => import('@/views/mall/Packages.vue'), meta: { title: '套餐管理' } },
      { path: 'mall/payments', name: 'MallPayments', component: () => import('@/views/mall/Payments.vue'), meta: { title: '支付管理' } },
      { path: 'marketing/ranking', name: 'MarketingRanking', component: () => import('@/views/marketing/Ranking.vue'), meta: { title: '排行榜激励' } },
      { path: 'marketing/points', name: 'MarketingPoints', component: () => import('@/views/marketing/Points.vue'), meta: { title: '积分管理' } },
      { path: 'device/water', name: 'DeviceWater', component: () => import('@/views/device/WaterRecords.vue'), meta: { title: '制水记录' } },
      { path: 'device/faults', name: 'DeviceFaults', component: () => import('@/views/device/DeviceFaults.vue'), meta: { title: '故障记录' } },
      { path: 'device/calibration', name: 'DeviceCalibration', component: () => import('@/views/device/DeviceCalibration.vue'), meta: { title: '设备校准' } },
      { path: 'workorder/tech-audit', name: 'TechAudit', component: () => import('@/views/workorder/TechAudit.vue'), meta: { title: '师傅审核' } },
      { path: 'inventory/list', name: 'InventoryList', component: () => import('@/views/inventory/InventoryList.vue'), meta: { title: '库存清单' } },
      { path: 'distribution/system', name: 'DistSystem', component: () => import('@/views/distribution/System.vue'), meta: { title: '分销体系' } },
      { path: 'distribution/region-dividend', name: 'RegionDividend', component: () => import('@/views/distribution/RegionDividend.vue'), meta: { title: '区域分红' } },
      { path: 'service/online', name: 'OnlineService', component: () => import('@/views/service/OnlineService.vue'), meta: { title: '在线客服' } },
      { path: 'system/accounts', name: 'SystemAccounts', component: () => import('@/views/system/Accounts.vue'), meta: { title: '账号设置' } },
      { path: 'system/roles', name: 'SystemRoles', component: () => import('@/views/system/Roles.vue'), meta: { title: '角色权限' } },
      { path: 'system/op-logs', name: 'SystemOpLogs', component: () => import('@/views/system/OpLogs.vue'), meta: { title: '操作日志' } },
      { path: 'system/notices', name: 'SystemNotices', component: () => import('@/views/system/Notices.vue'), meta: { title: '消息通知' } },
      { path: 'system/templates', name: 'SystemTemplates', component: () => import('@/views/system/MsgTemplates.vue'), meta: { title: '消息模板' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 简单登录守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.path === '/login') {
    next()
  } else if (!userStore.isLogin) {
    next('/login')
  } else {
    next()
  }
})

export default router
