// 侧边栏菜单分组配置
export const menuConfig = [
  { path: '/dashboard', title: '工作台', icon: 'Odometer' },
  {
    title: '数据中心',
    icon: 'DataLine',
    children: [
      { path: '/data-screen', title: '数据大屏', icon: 'Monitor', blank: true },
      { path: '/data/install', title: '装机数据', icon: 'TrendCharts' },
      { path: '/data/recharge', title: '充值数据', icon: 'Histogram' },
      { path: '/data/renewal', title: '续费数据', icon: 'RefreshRight' },
      { path: '/data/customer', title: '客户数据', icon: 'PieChart' }
    ]
  },
  {
    title: '商城管理',
    icon: 'ShoppingCart',
    children: [
      { path: '/mall/products', title: '商品列表', icon: 'Goods' },
      { path: '/mall/category', title: '商品分类', icon: 'Menu' },
      { path: '/mall/packages', title: '套餐管理', icon: 'Present' },
      { path: '/mall/orders', title: '订单管理', icon: 'List' },
      { path: '/mall/payments', title: '支付管理', icon: 'Money' }
    ]
  },
  {
    title: '营销中心',
    icon: 'Promotion',
    children: [
      { path: '/marketing/ranking', title: '排行榜激励', icon: 'Trophy' },
      { path: '/marketing/points', title: '积分管理', icon: 'GoldMedal' }
    ]
  },
  {
    title: '设备管理',
    icon: 'Cpu',
    children: [
      { path: '/device/list', title: '设备列表', icon: 'Monitor' },
      { path: '/device/models', title: '设备型号', icon: 'SetUp' },
      { path: '/device/water', title: '制水记录', icon: 'Histogram' },
      { path: '/device/faults', title: '故障记录', icon: 'WarnTriangleFilled' },
      { path: '/device/calibration', title: '设备校准', icon: 'Aim' }
    ]
  },
  {
    title: '服务工单',
    icon: 'Tickets',
    children: [
      { path: '/workorder/list', title: '工单列表', icon: 'Document' },
      { path: '/workorder/dispatch', title: '派单中心', icon: 'Promotion' },
      { path: '/workorder/technicians', title: '师傅管理', icon: 'Avatar' },
      { path: '/workorder/tech-audit', title: '师傅审核', icon: 'CircleCheck' }
    ]
  },
  {
    title: '库存管理',
    icon: 'Box',
    children: [{ path: '/inventory/list', title: '库存清单', icon: 'Box' }]
  },
  {
    title: '分销管理',
    icon: 'Share',
    children: [
      { path: '/distribution/overview', title: '分销概览', icon: 'DataAnalysis' },
      { path: '/distribution/members', title: '分销员', icon: 'UserFilled' },
      { path: '/distribution/system', title: '分销体系', icon: 'Connection' },
      { path: '/distribution/region-dividend', title: '区域分红', icon: 'MapLocation' },
      { path: '/distribution/commission', title: '佣金记录', icon: 'Money' },
      { path: '/distribution/withdraw', title: '提现审核', icon: 'Wallet' },
      { path: '/distribution/rules', title: '分润规则', icon: 'SetUp' }
    ]
  },
  {
    title: '客户管理',
    icon: 'User',
    children: [{ path: '/customer/list', title: '客户列表', icon: 'User' }]
  },
  {
    title: '充值管理',
    icon: 'CreditCard',
    children: [
      { path: '/recharge/packages', title: '充值套餐', icon: 'Present' },
      { path: '/recharge/records', title: '充值记录', icon: 'Tickets' }
    ]
  },
  { path: '/service/online', title: '在线客服', icon: 'ChatDotRound' },
  { path: '/page-builder', title: '页面装修', icon: 'Brush' },
  {
    title: '预警管理',
    icon: 'Warning',
    children: [
      { path: '/alert/list', title: '预警列表', icon: 'Bell' },
      { path: '/alert/rules', title: '预警规则', icon: 'SetUp' }
    ]
  },
  {
    title: '系统设置',
    icon: 'Setting',
    children: [
      { path: '/system/settings', title: '基础设置', icon: 'Tools' },
      { path: '/system/accounts', title: '账号设置', icon: 'User' },
      { path: '/system/roles', title: '角色权限', icon: 'Key' },
      { path: '/system/op-logs', title: '操作日志', icon: 'Document' },
      { path: '/system/notices', title: '消息通知', icon: 'Bell' },
      { path: '/system/templates', title: '消息模板', icon: 'ChatLineSquare' }
    ]
  }
]
