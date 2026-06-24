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
      { path: '/data/customer', title: '客户数据', icon: 'PieChart' }
    ]
  },
  {
    title: '商城管理',
    icon: 'ShoppingCart',
    children: [
      { path: '/mall/products', title: '商品列表', icon: 'Goods' },
      { path: '/mall/category', title: '商品分类', icon: 'Menu' },
      { path: '/mall/orders', title: '订单管理', icon: 'List' }
    ]
  },
  {
    title: '设备管理',
    icon: 'Cpu',
    children: [
      { path: '/device/list', title: '设备列表', icon: 'Monitor' },
      { path: '/device/models', title: '设备型号', icon: 'SetUp' }
    ]
  },
  {
    title: '服务工单',
    icon: 'Tickets',
    children: [
      { path: '/workorder/list', title: '工单列表', icon: 'Document' },
      { path: '/workorder/dispatch', title: '派单中心', icon: 'Promotion' },
      { path: '/workorder/technicians', title: '师傅管理', icon: 'Avatar' }
    ]
  },
  {
    title: '分销管理',
    icon: 'Share',
    children: [
      { path: '/distribution/overview', title: '分销概览', icon: 'DataAnalysis' },
      { path: '/distribution/members', title: '分销员', icon: 'UserFilled' },
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
    children: [{ path: '/system/settings', title: '系统设置', icon: 'Tools' }]
  }
]
