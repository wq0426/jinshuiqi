/**
 * 数据填充脚本：把原前端 mock 数据写入 MySQL。
 * 运行：npm run seed （可重复执行，会先重建表结构再插入）
 *
 * 数据生成逻辑直接移植自原 mock 文件，保证接口返回值与前端期望逐字段一致。
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/data-source';
import { Metric } from '../entities/metric.entity';
import {
  AdminAccount,
  AdminAlert,
  AdminAlertRule,
  AdminCategory,
  AdminChatSession,
  AdminCommission,
  AdminCustomer,
  AdminDevice,
  AdminDeviceCalibration,
  AdminDeviceFault,
  AdminDeviceModel,
  AdminDistRule,
  AdminDistributor,
  AdminInventory,
  AdminMsgTemplate,
  AdminNotice,
  AdminOpLog,
  AdminOrder,
  AdminPackage,
  AdminPaymentRecord,
  AdminPointRecord,
  AdminPointRule,
  AdminProduct,
  AdminRanking,
  AdminRechargePackage,
  AdminRechargeRecord,
  AdminRegionDividend,
  AdminRole,
  AdminStockLog,
  AdminTechApply,
  AdminTechnician,
  AdminWaterRecord,
  AdminWithdrawal,
  AdminWorkorder,
} from '../entities/admin.entities';
import {
  WxAddress,
  WxDevice,
  WxOrder,
  WxProduct,
  WxWorkorder,
} from '../entities/wx.entities';

const ALL_ENTITIES = [
  Metric,
  AdminCategory, AdminProduct, AdminOrder, AdminDevice, AdminDeviceModel,
  AdminWorkorder, AdminTechnician, AdminDistributor, AdminCommission,
  AdminWithdrawal, AdminDistRule, AdminCustomer, AdminRechargePackage,
  AdminRechargeRecord, AdminAlert, AdminAlertRule,
  AdminRanking, AdminPointRule, AdminPointRecord, AdminInventory, AdminStockLog,
  AdminRole, AdminAccount, AdminOpLog, AdminNotice, AdminMsgTemplate,
  AdminTechApply, AdminDeviceFault, AdminDeviceCalibration, AdminWaterRecord,
  AdminChatSession, AdminPaymentRecord, AdminPackage, AdminRegionDividend,
  WxProduct, WxDevice, WxWorkorder, WxOrder, WxAddress,
];

// ============================================================
// 一、管理后台数据（移植自 admin/src/mock/*.js）
// ============================================================

// ---- 商品分类 ----
const categories = [
  { id: 1, name: '净水器整机', sort: 1, count: 8 },
  { id: 2, name: '滤芯耗材', sort: 2, count: 12 },
  { id: 3, name: '前置过滤器', sort: 3, count: 5 },
  { id: 4, name: '管线机', sort: 4, count: 4 },
  { id: 5, name: '配件附件', sort: 5, count: 9 },
  { id: 6, name: '充值套餐卡', sort: 6, count: 6 },
];

const grads = [
  'linear-gradient(135deg,#3A8EF6,#26C6DA)',
  'linear-gradient(135deg,#52c41a,#95de64)',
  'linear-gradient(135deg,#faad14,#ffc53d)',
  'linear-gradient(135deg,#9254de,#b37feb)',
  'linear-gradient(135deg,#13c2c2,#36cfc9)',
  'linear-gradient(135deg,#ff7a45,#ff9c6e)',
];
const productNames = [
  '德康泉 RO 反渗透净水器 JSQ-R600', '家用直饮纯水机 JSQ-R800 Pro', '台式即热饮水机 JSQ-T100',
  '前置过滤器 40微米 JSQ-Q1', '中央净水机大流量 JSQ-C2000', 'PP 棉滤芯（5寸通用）',
  '活性炭复合滤芯 CTO', 'RO 反渗透膜 600G', '后置椰壳活性炭滤芯', '管线机壁挂即热 JSQ-G5',
  '净水器专用快接管 2米', '鹅颈龙头 304不锈钢', '智能水质 TDS 检测笔', '净水年卡（12期滤芯）',
  '软水机 JSQ-S20', '商用净水设备 JSQ-B5000', '母婴专用净水器 JSQ-M300', '厨下式超滤机 JSQ-U400',
  '增压泵配件', '废水比调节阀', '净水套餐季卡', '净水套餐月卡', '滤芯三件套优惠装', '智能水龙头 JSQ-F9',
];
const products = productNames.map((name, i) => {
  const catId = (i % 6) + 1;
  return {
    id: 1000 + i,
    name,
    image: grads[i % grads.length],
    categoryId: catId,
    category: categories.find((c) => c.id === catId)!.name,
    price: +(199 + ((i * 137) % 4500)).toFixed(2),
    originPrice: +(299 + ((i * 137) % 4500) + 200).toFixed(2),
    stock: 20 + ((i * 17) % 480),
    sales: 30 + ((i * 53) % 2000),
    onSale: i % 5 !== 0,
    sort: i + 1,
    createTime: `2026-0${(i % 5) + 1}-1${i % 9} 1${i % 9}:30`,
  };
});

// ---- 订单 ----
const orderCustomers = ['李建国', '王秀英', '张伟', '陈芳', '刘强', '赵敏', '孙丽', '周杰', '吴娟', '郑涛', '冯婷', '蒋华'];
const orderAreas = ['杭州市西湖区文一路', '杭州市拱墅区莫干山路', '宁波市海曙区中山路', '杭州市余杭区五常大道', '温州市鹿城区车站大道', '杭州市滨江区江南大道', '绍兴市越城区胜利路', '嘉兴市南湖区中山东路'];
const orderStatusList = ['待付款', '待发货', '待收货', '已完成', '已取消', '退款中'];
const goodsPool = [
  { name: '德康泉 RO 反渗透净水器 JSQ-R600', price: 2680 },
  { name: 'PP 棉滤芯（5寸通用）', price: 49 },
  { name: 'RO 反渗透膜 600G', price: 320 },
  { name: '管线机壁挂即热 JSQ-G5', price: 1280 },
  { name: '净水年卡（12期滤芯）', price: 599 },
];
const orders = Array.from({ length: 26 }).map((_, i) => {
  const status = orderStatusList[i % orderStatusList.length];
  const itemCount = (i % 3) + 1;
  const items = Array.from({ length: itemCount }).map((__, j) => {
    const g = goodsPool[(i + j) % goodsPool.length];
    const qty = (j % 2) + 1;
    return { ...g, qty, subtotal: g.price * qty, image: 'linear-gradient(135deg,#3A8EF6,#26C6DA)' };
  });
  const total = items.reduce((s, it) => s + it.subtotal, 0);
  return {
    id: 'OD2026061' + String(600 - i).padStart(4, '0'),
    customer: orderCustomers[i % orderCustomers.length],
    phone: '138' + String(10000000 + i * 137).slice(0, 8),
    address: orderAreas[i % orderAreas.length] + ` ${i + 1}号楼${(i % 6) + 1}单元`,
    items,
    amount: total,
    payAmount: status === '待付款' ? 0 : total,
    status,
    payType: ['微信支付', '余额支付', '支付宝'][i % 3],
    createTime: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    logistics: [
      { time: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} 08:30`, desc: '订单已提交，等待付款' },
      { time: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} 09:15`, desc: '买家已付款' },
      { time: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} 14:20`, desc: '商品已出库，等待揽收' },
      { time: `2026-06-${String(17 - (i % 15)).padStart(2, '0')} 10:05`, desc: '快件已到达【杭州转运中心】' },
      { time: `2026-06-${String(18 - (i % 15)).padStart(2, '0')} 16:40`, desc: '正在派送，请保持电话畅通' },
    ],
  };
});

// ---- 设备 ----
const deviceModelNames = ['JSQ-R600', 'JSQ-R800 Pro', 'JSQ-G5', 'JSQ-C2000', 'JSQ-U400', 'JSQ-M300'];
const deviceCustomers = ['李建国', '王秀英', '张伟', '陈芳', '刘强', '赵敏', '孙丽', '周杰', '吴娟', '郑涛', '冯婷', '蒋华', '韩雪', '杨光', '朱琳'];
const deviceAreas = ['杭州市西湖区', '杭州市拱墅区', '宁波市海曙区', '杭州市余杭区', '温州市鹿城区', '杭州市滨江区'];
const deviceModels = [
  { id: 1, name: 'JSQ-R600', type: 'RO反渗透', capacity: '600G', filters: 5, price: 2680, status: '在售', count: 860 },
  { id: 2, name: 'JSQ-R800 Pro', type: 'RO反渗透', capacity: '800G', filters: 4, price: 3680, status: '在售', count: 520 },
  { id: 3, name: 'JSQ-G5', type: '管线机', capacity: '-', filters: 1, price: 1280, status: '在售', count: 340 },
  { id: 4, name: 'JSQ-C2000', type: '中央净水', capacity: '2000L/h', filters: 1, price: 5800, status: '在售', count: 96 },
  { id: 5, name: 'JSQ-U400', type: '超滤机', capacity: '400G', filters: 4, price: 1680, status: '在售', count: 410 },
  { id: 6, name: 'JSQ-M300', type: '母婴净水', capacity: '300G', filters: 5, price: 2980, status: '停产', count: 60 },
];
const devices = Array.from({ length: 28 }).map((_, i) => {
  const online = i % 4 !== 0;
  const filterLife = (i * 13) % 100;
  return {
    id: 'DV' + String(20260000 + i * 37),
    sn: 'SN' + String(88000000 + i * 1379),
    model: deviceModelNames[i % deviceModelNames.length],
    customer: deviceCustomers[i % deviceCustomers.length],
    phone: '138' + String(20000000 + i * 211).slice(0, 8),
    area: deviceAreas[i % deviceAreas.length],
    online,
    filterLife,
    tds: 18 + ((i * 7) % 60),
    inTds: 180 + ((i * 11) % 200),
    waterToday: +(20 + ((i * 3.7) % 80)).toFixed(1),
    waterTotal: +(800 + i * 137).toFixed(0),
    temperature: 24 + (i % 6),
    lastReport: `2026-06-16 ${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    installDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
    power: online,
    flushing: false,
    waterCurve: Array.from({ length: 24 }).map((__, h) => +(2 + Math.abs(Math.sin((h + i) / 3)) * 8).toFixed(1)),
  };
});

// ---- 工单 ----
const woTypes = ['装机', '拆机', '迁机', '返库', '维修'];
const woStatuses = ['已下单', '已派单', '上门中', '服务中', '已完成'];
const woCustomers = ['李建国', '王秀英', '张伟', '陈芳', '刘强', '赵敏', '孙丽', '周杰', '吴娟', '郑涛', '冯婷', '蒋华', '韩雪', '杨光'];
const woAreas = ['杭州市西湖区文一路 88号', '杭州市拱墅区莫干山路 12号', '宁波市海曙区中山路 56号', '杭州市余杭区五常大道 200号', '温州市鹿城区车站大道 9号', '杭州市滨江区江南大道 1000号'];
const woTechs = ['赵师傅', '钱师傅', '孙师傅', '李师傅', '周师傅', ''];
const woModels = ['JSQ-R600', 'JSQ-R800 Pro', 'JSQ-G5', 'JSQ-U400'];
const workorders = Array.from({ length: 30 }).map((_, i) => {
  const type = woTypes[i % woTypes.length];
  const statusIdx = i % woStatuses.length;
  const status = woStatuses[statusIdx];
  const tech = status === '已下单' ? '' : woTechs[i % (woTechs.length - 1)];
  const day = String(16 - (i % 15)).padStart(2, '0');
  const fullTimeline = [
    { status: '已下单', time: `2026-06-${day} 09:0${i % 9}`, desc: '客户提交服务申请' },
    { status: '已派单', time: `2026-06-${day} 10:1${i % 9}`, desc: `已指派给 ${tech || '待定'}` },
    { status: '上门中', time: `2026-06-${day} 13:2${i % 9}`, desc: '师傅已出发，预计30分钟到达' },
    { status: '服务中', time: `2026-06-${day} 14:0${i % 9}`, desc: '师傅已到达现场，开始作业' },
    { status: '已完成', time: `2026-06-${day} 15:3${i % 9}`, desc: '服务完成，客户已确认验收' },
  ];
  return {
    id: 'WO2026061' + String(600 - i).padStart(4, '0'),
    type,
    status,
    customer: woCustomers[i % woCustomers.length],
    phone: '137' + String(10000000 + i * 233).slice(0, 8),
    address: woAreas[i % woAreas.length],
    deviceModel: woModels[i % woModels.length],
    deviceSn: 'SN' + String(88000000 + i * 1379),
    technician: tech,
    createTime: `2026-06-${day} 09:0${i % 9}`,
    appointTime: `2026-06-${day} 14:00 - 16:00`,
    remark: ['客户家中有老人，请耐心服务', '需自带工具', '二楼，无电梯', '小区门禁需登记', ''][i % 5],
    timeline: fullTimeline.slice(0, statusIdx + 1),
    photos: status === '已完成' ? ['linear-gradient(135deg,#3A8EF6,#26C6DA)', 'linear-gradient(135deg,#52c41a,#95de64)', 'linear-gradient(135deg,#faad14,#ffc53d)'] : [],
  };
});

// ---- 师傅 ----
const techNames = ['赵师傅', '钱师傅', '孙师傅', '李师傅', '周师傅', '吴师傅', '郑师傅', '王师傅', '冯师傅', '陈师傅', '褚师傅', '卫师傅'];
const techAreas = ['西湖区', '拱墅区', '余杭区', '滨江区', '海曙区', '鹿城区'];
const technicians = techNames.map((name, i) => ({
  id: 'TECH' + String(1000 + i),
  name,
  phone: '139' + String(10000000 + i * 311).slice(0, 8),
  area: techAreas[i % techAreas.length] + '、' + techAreas[(i + 1) % techAreas.length],
  online: i % 3 !== 0,
  rating: +(4.3 + (i % 7) * 0.1).toFixed(1),
  ongoing: i % 5,
  totalOrders: 120 + ((i * 37) % 600),
  level: ['金牌师傅', '银牌师傅', '认证师傅'][i % 3],
  joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
}));

// ---- 客户 ----
const custNames = ['李建国', '王秀英', '张伟', '陈芳', '刘强', '赵敏', '孙丽', '周杰', '吴娟', '郑涛', '冯婷', '蒋华', '韩雪', '杨光', '朱琳', '秦勇', '许静', '何磊', '吕娜', '施洋'];
const custAreas = ['杭州市西湖区', '杭州市拱墅区', '宁波市海曙区', '杭州市余杭区', '温州市鹿城区', '杭州市滨江区'];
const custLevels = ['普通', '会员', '合伙人'];
const customers = custNames.map((name, i) => ({
  id: 'CU' + String(100000 + i),
  name,
  nickname: name + (['', '的家', '888', 'Mr', '~'][i % 5]),
  phone: '135' + String(10000000 + i * 191).slice(0, 8),
  area: custAreas[i % custAreas.length],
  balance: +(50 + ((i * 137) % 3000)).toFixed(2),
  points: (i * 73) % 5000,
  level: custLevels[i % 3],
  deviceCount: (i % 4) + 1,
  orderCount: (i * 3) % 20,
  registerDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
  lastActive: `2026-06-${String(16 - (i % 15)).padStart(2, '0')}`,
  devices: Array.from({ length: (i % 3) + 1 }).map((_, j) => ({
    sn: 'SN' + String(88000000 + (i * 10 + j) * 137),
    model: ['JSQ-R600', 'JSQ-G5', 'JSQ-U400'][j % 3],
    online: (i + j) % 3 !== 0,
    filterLife: ((i + j) * 17) % 100,
  })),
  orders: Array.from({ length: (i % 3) + 1 }).map((_, j) => ({
    id: 'OD2026061' + String(600 - i * 3 - j).padStart(4, '0'),
    goods: ['净水器 JSQ-R600', 'PP棉滤芯', '净水年卡'][j % 3],
    amount: +(99 + ((i * 53 + j * 17) % 2680)).toFixed(2),
    status: ['已完成', '待发货', '待收货'][j % 3],
    time: `2026-0${(i % 5) + 1}-1${j} 14:30`,
  })),
  workorders: Array.from({ length: (i % 2) + 1 }).map((_, j) => ({
    id: 'WO2026061' + String(600 - i * 2 - j).padStart(4, '0'),
    type: ['装机', '维修', '迁机'][j % 3],
    status: ['已完成', '服务中'][j % 2],
    time: `2026-0${(i % 5) + 1}-1${j} 10:00`,
  })),
}));

// ---- 分销 ----
const distNames = ['李明', '王芳', '张磊', '陈静', '刘洋', '赵丽', '孙强', '周敏', '吴勇', '郑娜', '冯涛', '蒋燕', '韩冰', '杨帆', '朱琳'];
const distLevels = ['普通', '会员', '合伙人'];
const distributors = distNames.map((name, i) => ({
  id: 'DS' + String(10000 + i),
  name,
  phone: '136' + String(10000000 + i * 271).slice(0, 8),
  level: distLevels[i % 3],
  parent: i === 0 ? '-' : distNames[(i - 1) % distNames.length],
  teamSize: (i * 7) % 120,
  directCount: (i * 3) % 30,
  totalCommission: +(1000 + ((i * 1379) % 50000)).toFixed(2),
  monthCommission: +(200 + ((i * 337) % 8000)).toFixed(2),
  joinDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
}));
const commStatusList = ['已结算', '待结算', '已冻结'];
const commissions = Array.from({ length: 24 }).map((_, i) => ({
  id: 'CM' + String(2026000 + i),
  distributor: distNames[i % distNames.length],
  type: ['直推佣金', '间推佣金', '平级奖', '团队管理奖'][i % 4],
  orderId: 'OD2026061' + String(600 - i).padStart(4, '0'),
  amount: +(20 + ((i * 73) % 980)).toFixed(2),
  rate: [15, 8, 3, 5][i % 4] + '%',
  status: commStatusList[i % 3],
  time: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} ${String(9 + (i % 10)).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
}));
const wStatusList = ['待审核', '已通过', '已驳回'];
const withdrawals = Array.from({ length: 18 }).map((_, i) => ({
  id: 'WD' + String(2026000 + i),
  distributor: distNames[i % distNames.length],
  phone: '136' + String(10000000 + i * 271).slice(0, 8),
  amount: +(100 + ((i * 173) % 5000)).toFixed(2),
  account: ['微信', '支付宝', '银行卡'][i % 3],
  accountNo: ['wxid_***' + (1000 + i), '186****' + (2000 + i), '6228****' + (3000 + i)][i % 3],
  status: i < 8 ? '待审核' : wStatusList[i % 3],
  applyTime: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} ${String(9 + (i % 10)).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
  remark: null as any,
}));
const distRules = [
  { id: 1, level: '普通', directRate: 10, indirectRate: 3, upCondition: '完成首单即升级会员', enabled: true },
  { id: 2, level: '会员', directRate: 15, indirectRate: 5, upCondition: '直推3人 且 团队业绩满10000元', enabled: true },
  { id: 3, level: '合伙人', directRate: 20, indirectRate: 8, upCondition: '直推10人 且 团队业绩满100000元', enabled: true },
];
const distOverview = {
  totalMembers: 1286, newMembers: 64, totalCommission: 386500, pendingWithdraw: 28600,
  trend: { months: ['1月', '2月', '3月', '4月', '5月', '6月'], commission: [42000, 51000, 48000, 62000, 58000, 71000], members: [820, 920, 1010, 1120, 1200, 1286] },
  levelDist: [{ name: '普通', value: 860 }, { name: '会员', value: 320 }, { name: '合伙人', value: 106 }],
};

// ---- 预警 ----
const alertTypes = ['滤芯到期', '设备离线', '水质异常', '工单超时', '库存不足'];
const alertLevels = ['高', '中', '低'];
const alertCustomers = ['李建国', '王秀英', '张伟', '陈芳', '刘强', '赵敏', '孙丽', '周杰'];
const alerts = Array.from({ length: 26 }).map((_, i) => {
  const type = alertTypes[i % alertTypes.length];
  const targetMap: any = {
    滤芯到期: 'SN' + String(88000000 + i * 137),
    设备离线: 'SN' + String(88000000 + i * 211),
    水质异常: 'SN' + String(88000000 + i * 311),
    工单超时: 'WO2026061' + String(600 - i).padStart(4, '0'),
    库存不足: 'PP棉滤芯（5寸通用）',
  };
  const descMap: any = {
    滤芯到期: '滤芯寿命剩余不足 5%，建议尽快更换',
    设备离线: '设备已离线超过 24 小时',
    水质异常: 'TDS 值异常升高至 85，超出安全阈值',
    工单超时: '工单超过 4 小时未派单',
    库存不足: '当前库存 12 件，低于安全库存 50 件',
  };
  return {
    id: 'AL' + String(2026000 + i),
    type,
    level: alertLevels[i % 3],
    target: targetMap[type],
    customer: type === '库存不足' ? '-' : alertCustomers[i % alertCustomers.length],
    desc: descMap[type],
    status: i % 3 === 0 ? '已处理' : '待处理',
    time: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
  };
});
const alertRules = [
  { id: 1, type: '滤芯到期', threshold: 5, unit: '%', desc: '滤芯剩余寿命低于阈值时触发', level: '中', enabled: true },
  { id: 2, type: '设备离线', threshold: 24, unit: '小时', desc: '设备离线时长超过阈值时触发', level: '低', enabled: true },
  { id: 3, type: '水质异常', threshold: 80, unit: 'TDS', desc: '出水 TDS 超过阈值时触发', level: '高', enabled: true },
  { id: 4, type: '工单超时', threshold: 4, unit: '小时', desc: '工单未派单时长超过阈值时触发', level: '中', enabled: true },
  { id: 5, type: '库存不足', threshold: 50, unit: '件', desc: '商品库存低于阈值时触发', level: '低', enabled: false },
];

// ---- 充值 ----
const rechargePackages = [
  { id: 1, name: '月卡套餐', amount: 99, gift: 0, desc: '含1期滤芯更换 + 30天质保', sales: 1280, enabled: true, tag: '热销' },
  { id: 2, name: '季卡套餐', amount: 269, gift: 20, desc: '含3期滤芯更换 + 季度水质检测', sales: 860, enabled: true, tag: '推荐' },
  { id: 3, name: '半年卡', amount: 499, gift: 50, desc: '含6期滤芯 + 优先上门', sales: 540, enabled: true, tag: '' },
  { id: 4, name: '年卡套餐', amount: 899, gift: 120, desc: '含12期滤芯 + 全年质保 + 免费迁机1次', sales: 720, enabled: true, tag: '超值' },
  { id: 5, name: '两年卡', amount: 1599, gift: 300, desc: '含24期滤芯 + 终身质保', sales: 210, enabled: true, tag: '' },
  { id: 6, name: '体验充值', amount: 50, gift: 0, desc: '余额充值，按次扣费', sales: 2100, enabled: false, tag: '' },
];
const rcCustomers = ['李建国', '王秀英', '张伟', '陈芳', '刘强', '赵敏', '孙丽', '周杰', '吴娟', '郑涛'];
const pkgNames = ['月卡套餐', '季卡套餐', '半年卡', '年卡套餐', '两年卡', '体验充值'];
const rcStatusList = ['成功', '处理中', '已退款'];
const rechargeRecords = Array.from({ length: 24 }).map((_, i) => {
  const pkg = pkgNames[i % pkgNames.length];
  const amount = [99, 269, 499, 899, 1599, 50][i % 6];
  return {
    id: 'RC' + String(2026000 + i),
    customer: rcCustomers[i % rcCustomers.length],
    phone: '134' + String(10000000 + i * 191).slice(0, 8),
    package: pkg,
    amount,
    payType: ['微信支付', '支付宝', '余额'][i % 3],
    status: i % 7 === 0 ? '处理中' : rcStatusList[i % 3 === 2 ? 2 : 0],
    time: `2026-06-${String(16 - (i % 15)).padStart(2, '0')} ${String(9 + (i % 10)).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
  };
});
const rechargeTrend = {
  days: ['6-10', '6-11', '6-12', '6-13', '6-14', '6-15', '6-16'],
  amount: [12800, 15600, 13200, 18900, 21300, 19800, 32400],
  count: [86, 102, 91, 128, 145, 132, 198],
};

// ---- 工作台 ----
const statCards = [
  { label: '今日装机', value: 38, icon: 'Cpu', trend: 12.5, suffix: ' 台', gradient: 'linear-gradient(135deg,#3A8EF6,#26C6DA)' },
  { label: '今日营收', value: '18,650', icon: 'Money', trend: 8.2, prefix: '¥', gradient: 'linear-gradient(135deg,#52c41a,#95de64)' },
  { label: '在线设备', value: 2486, icon: 'Monitor', trend: 3.1, suffix: ' 台', gradient: 'linear-gradient(135deg,#13c2c2,#36cfc9)' },
  { label: '待派工单', value: 27, icon: 'Tickets', trend: -5.4, suffix: ' 单', gradient: 'linear-gradient(135deg,#faad14,#ffc53d)' },
  { label: '新增客户', value: 64, icon: 'User', trend: 15.7, suffix: ' 人', gradient: 'linear-gradient(135deg,#9254de,#b37feb)' },
  { label: '今日充值', value: '32,400', icon: 'Wallet', trend: 6.8, prefix: '¥', gradient: 'linear-gradient(135deg,#ff7a45,#ff9c6e)' },
];
const revenueTrend = {
  days: ['6-03', '6-04', '6-05', '6-06', '6-07', '6-08', '6-09', '6-10', '6-11', '6-12', '6-13', '6-14', '6-15', '6-16'],
  revenue: [12300, 13800, 11200, 14500, 16800, 15200, 17600, 18200, 16900, 19400, 20100, 18650, 21300, 18650],
  recharge: [8200, 9100, 7600, 9800, 11200, 10500, 12100, 13400, 12000, 14200, 15100, 13800, 16200, 32400],
};
const workorderStatus = [
  { name: '待派单', value: 27 }, { name: '上门中', value: 18 }, { name: '服务中', value: 12 },
  { name: '已完成', value: 186 }, { name: '已取消', value: 9 },
];
const todoList = [
  { title: '提现审核', count: 8, icon: 'Wallet', color: '#3A8EF6' },
  { title: '待派工单', count: 27, icon: 'Tickets', color: '#faad14' },
  { title: '滤芯到期预警', count: 14, icon: 'Warning', color: '#ff4d4f' },
  { title: '待审分销员', count: 5, icon: 'UserFilled', color: '#52c41a' },
  { title: '设备离线告警', count: 11, icon: 'Monitor', color: '#9254de' },
];
const latestWorkorders = [
  { id: 'WO20260616001', type: '装机', customer: '李建国', area: '杭州市西湖区', status: '待派单', time: '2026-06-16 09:12' },
  { id: 'WO20260616002', type: '维修', customer: '王秀英', area: '杭州市拱墅区', status: '上门中', time: '2026-06-16 08:45' },
  { id: 'WO20260615088', type: '迁机', customer: '张伟', area: '宁波市海曙区', status: '服务中', time: '2026-06-15 16:30' },
  { id: 'WO20260615076', type: '拆机', customer: '陈芳', area: '杭州市余杭区', status: '已完成', time: '2026-06-15 14:20' },
  { id: 'WO20260615061', type: '返库', customer: '刘强', area: '温州市鹿城区', status: '已完成', time: '2026-06-15 11:05' },
  { id: 'WO20260615054', type: '装机', customer: '赵敏', area: '杭州市滨江区', status: '待派单', time: '2026-06-15 10:18' },
];

// ---- 数据中心 ----
const installData = {
  trend: { months: ['1月', '2月', '3月', '4月', '5月', '6月'], count: [320, 410, 380, 520, 610, 680] },
  byArea: [{ name: '西湖区', value: 860 }, { name: '拱墅区', value: 720 }, { name: '余杭区', value: 640 }, { name: '滨江区', value: 580 }, { name: '海曙区', value: 420 }, { name: '鹿城区', value: 360 }],
  byModel: [{ name: 'JSQ-R600', value: 860 }, { name: 'JSQ-R800 Pro', value: 520 }, { name: 'JSQ-G5', value: 340 }, { name: 'JSQ-U400', value: 410 }, { name: '其他', value: 156 }],
  table: Array.from({ length: 12 }).map((_, i) => ({
    date: `2026-06-${String(16 - i).padStart(2, '0')}`,
    area: ['西湖区', '拱墅区', '余杭区', '滨江区'][i % 4],
    model: ['JSQ-R600', 'JSQ-R800 Pro', 'JSQ-G5', 'JSQ-U400'][i % 4],
    count: 12 + ((i * 7) % 50),
    technician: ['赵师傅', '钱师傅', '孙师傅', '李师傅'][i % 4],
  })),
};
const rechargeAnalysis = {
  trend: { months: ['1月', '2月', '3月', '4月', '5月', '6月'], amount: [186000, 210000, 198000, 256000, 288000, 326000] },
  byPackage: [{ name: '月卡套餐', value: 1280 }, { name: '季卡套餐', value: 860 }, { name: '半年卡', value: 540 }, { name: '年卡套餐', value: 720 }, { name: '两年卡', value: 210 }],
  payType: [{ name: '微信支付', value: 62 }, { name: '支付宝', value: 28 }, { name: '余额支付', value: 10 }],
  table: Array.from({ length: 12 }).map((_, i) => ({
    date: `2026-06-${String(16 - i).padStart(2, '0')}`,
    amount: 12000 + ((i * 1379) % 24000),
    count: 80 + ((i * 7) % 120),
    avgAmount: +(150 + ((i * 13) % 400)).toFixed(2),
  })),
};
const customerAnalysis = {
  growth: { months: ['1月', '2月', '3月', '4月', '5月', '6月'], total: [820, 920, 1010, 1120, 1200, 1286], newly: [86, 100, 90, 110, 80, 86] },
  levelDist: [{ name: '普通', value: 860 }, { name: '会员', value: 320 }, { name: '合伙人', value: 106 }],
  areaDist: [{ name: '西湖区', value: 320 }, { name: '拱墅区', value: 280 }, { name: '余杭区', value: 240 }, { name: '滨江区', value: 210 }, { name: '海曙区', value: 136 }, { name: '鹿城区', value: 100 }],
  activity: [{ name: '高活跃', value: 420 }, { name: '中活跃', value: 580 }, { name: '低活跃', value: 286 }],
  table: Array.from({ length: 12 }).map((_, i) => ({
    date: `2026-06-${String(16 - i).padStart(2, '0')}`,
    newCustomer: 6 + ((i * 3) % 20),
    activeCustomer: 200 + ((i * 17) % 300),
    area: ['西湖区', '拱墅区', '余杭区', '滨江区'][i % 4],
  })),
};
const screenData = {
  flipNumbers: [
    { label: '累计装机量(台)', value: 12860 }, { label: '在线设备(台)', value: 8642 },
    { label: '累计营收(万元)', value: 3865 }, { label: '服务客户(人)', value: 12860 },
    { label: '本月工单(单)', value: 1286 }, { label: '签约师傅(人)', value: 186 },
  ],
  cityInstall: [
    { name: '杭州', value: 4860 }, { name: '宁波', value: 2420 }, { name: '温州', value: 1860 },
    { name: '绍兴', value: 1240 }, { name: '嘉兴', value: 980 }, { name: '金华', value: 760 }, { name: '台州', value: 540 },
  ],
  rechargeLine: { months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], amount: [186, 210, 198, 256, 288, 326, 310, 345, 360, 388, 410, 432] },
  customerGrowth: { months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], value: [820, 920, 1010, 1120, 1200, 1286, 1380, 1460, 1560, 1680, 1820, 1960] },
  onlineRate: 86.4,
  workorderType: [{ name: '装机', value: 680 }, { name: '维修', value: 320 }, { name: '迁机', value: 180 }, { name: '拆机', value: 96 }, { name: '返库', value: 60 }],
  realtimeList: Array.from({ length: 20 }).map((_, i) => ({
    time: `${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    area: ['杭州西湖区', '宁波海曙区', '温州鹿城区', '绍兴越城区', '嘉兴南湖区'][i % 5],
    type: ['装机', '维修', '充值', '迁机', '下单'][i % 5],
    customer: ['李**', '王**', '张**', '陈**', '刘**'][i % 5],
    amount: '¥' + (99 + ((i * 137) % 3000)),
  })),
};

// ============================================================
// 二、小程序数据（移植自 miniprogram/utils/mock.js）
// ============================================================
const G = [
  'linear-gradient(135deg,#3A8EF6,#26C6DA)', 'linear-gradient(135deg,#42d392,#26c6da)',
  'linear-gradient(135deg,#8e7bff,#5b9bff)', 'linear-gradient(135deg,#ff9f43,#ffd166)',
  'linear-gradient(135deg,#56ccf2,#6fe3c7)', 'linear-gradient(135deg,#ff6a88,#ff99ac)',
  'linear-gradient(135deg,#36d1dc,#5b86e5)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];
const wxBanners = [
  { id: 1, title: '新款反渗透净水器', subtitle: '5重过滤 · 即滤即饮', color: G[0], emoji: '💧' },
  { id: 2, title: '老客户专享', subtitle: '滤芯换新 7 折起', color: G[2], emoji: '🎁' },
  { id: 3, title: '上门安装无忧', subtitle: '专业师傅 · 30分钟响应', color: G[4], emoji: '🔧' },
];
const wxGrids = [
  { id: 'mall', name: '商城', emoji: '🛒', color: G[0], url: '/pages/mall/mall', tab: true },
  { id: 'booking', name: '装机预约', emoji: '🔧', color: G[1], url: '/pages/service/booking' },
  { id: 'device', name: '我的设备', emoji: '📟', color: G[2], url: '/pages/device/list' },
  { id: 'dist', name: '分销中心', emoji: '💰', color: G[3], url: '/pages/distribution/index' },
  { id: 'recharge', name: '充值', emoji: '💳', color: G[4], url: '/pages/recharge/recharge' },
  { id: 'repair', name: '维修', emoji: '🛠️', color: G[5], url: '/pages/service/booking' },
  { id: 'water', name: '水质检测', emoji: '🔬', color: G[6], url: '/pages/device/control' },
  { id: 'all', name: '全部', emoji: '⋯', color: G[7], url: '/pages/service/service', tab: true },
];
const wxCategories = [
  { id: 'all', name: '全部' }, { id: 'ro', name: '反渗透机' }, { id: 'uf', name: '超滤机' },
  { id: 'filter', name: '滤芯耗材' }, { id: 'soft', name: '软水机' }, { id: 'heat', name: '管线机' }, { id: 'gift', name: '配件礼包' },
];
const wxProducts = [
  { id: 1, cat: 'ro', title: '净享 R600 反渗透净水器', desc: '600G大通量 · 即滤即饮 · 3:1低废水', price: 2680, oldPrice: 3280, sales: 1280, color: G[0], emoji: '💧', tags: ['爆款', '包安装'] },
  { id: 2, cat: 'ro', title: '净享 R800 Pro 旗舰版', desc: '800G双出水 · 智能TDS显示屏', price: 3980, oldPrice: 4680, sales: 860, color: G[2], emoji: '🚰', tags: ['新品', '智能'] },
  { id: 3, cat: 'uf', title: '净享 U5 超滤直饮机', desc: '0.01微米超滤 · 保留矿物质', price: 1280, oldPrice: 1680, sales: 2100, color: G[4], emoji: '💦', tags: ['热销'] },
  { id: 4, cat: 'filter', title: 'PP棉+活性炭复合滤芯', desc: '通用前置滤芯 · 建议6个月更换', price: 128, oldPrice: 168, sales: 5600, color: G[3], emoji: '🧴', tags: ['耗材'] },
  { id: 5, cat: 'filter', title: 'RO反渗透膜滤芯', desc: '原厂正品 · 24个月长效', price: 398, oldPrice: 498, sales: 3200, color: G[6], emoji: '🧪', tags: ['原厂'] },
  { id: 6, cat: 'soft', title: '净享 S2 中央软水机', desc: '离子交换 · 软化全屋用水', price: 5680, oldPrice: 6880, sales: 320, color: G[5], emoji: '🛁', tags: ['全屋'] },
  { id: 7, cat: 'heat', title: '净享 H1 即热管线机', desc: '3秒速热 · 多档水温可调', price: 1580, oldPrice: 1980, sales: 740, color: G[7], emoji: '☕', tags: ['即热'] },
  { id: 8, cat: 'ro', title: '净享 R400 入门款', desc: '400G通量 · 厨下式安装', price: 1880, oldPrice: 2280, sales: 1560, color: G[1], emoji: '🥤', tags: ['性价比'] },
  { id: 9, cat: 'gift', title: '安装配件大礼包', desc: '水管+三通+龙头 全套配件', price: 88, oldPrice: 128, sales: 4300, color: G[3], emoji: '📦', tags: ['配件'] },
  { id: 10, cat: 'uf', title: '净享 U8 厨上超滤机', desc: '台面免安装 · 即插即用', price: 980, oldPrice: 1280, sales: 1900, color: G[0], emoji: '🫗', tags: ['免装'] },
  { id: 11, cat: 'heat', title: '净享 H3 冷热管线机', desc: '冰热双制 · 食品级内胆', price: 2280, oldPrice: 2680, sales: 410, color: G[2], emoji: '🧊', tags: ['冷热'] },
  { id: 12, cat: 'filter', title: '后置活性炭滤芯', desc: '改善口感 · 12个月长效', price: 158, oldPrice: 198, sales: 2800, color: G[4], emoji: '⚫', tags: ['口感'] },
];
const wxProductSpecs = ['标准版（含基础安装）', '尊享版（含3年滤芯）', '以旧换新版'];
const wxDevices = [
  { id: 'D2024001', name: '净享 R800 Pro', model: 'R800-Pro', room: '厨房', online: true, tdsIn: 286, tdsOut: 18, color: G[0], emoji: '💧', todayWater: 12.6, totalWater: 3860, power: true, filters: [{ name: 'PP棉滤芯', life: 62, days: 112 }, { name: '活性炭滤芯', life: 45, days: 81 }, { name: 'RO反渗透膜', life: 78, days: 421 }, { name: '后置活性炭', life: 30, days: 54 }] },
  { id: 'D2024002', name: '净享 U5 超滤直饮机', model: 'U5', room: '客厅', online: true, tdsIn: 310, tdsOut: 96, color: G[4], emoji: '💦', todayWater: 6.2, totalWater: 1240, power: true, filters: [{ name: 'PP棉滤芯', life: 80, days: 145 }, { name: '超滤膜', life: 55, days: 198 }] },
  { id: 'D2024003', name: '净享 S2 中央软水机', model: 'S2', room: '阳台', online: false, tdsIn: 0, tdsOut: 0, color: G[5], emoji: '🛁', todayWater: 0, totalWater: 8900, power: false, filters: [{ name: '树脂滤料', life: 40, days: 220 }] },
];
const wxWaterChart = [
  { day: '周一', value: 10.2 }, { day: '周二', value: 14.6 }, { day: '周三', value: 8.9 }, { day: '周四', value: 16.3 },
  { day: '周五', value: 12.1 }, { day: '周六', value: 18.7 }, { day: '周日', value: 12.6 },
];
const wxServiceTypes = [
  { id: 'install', name: '装机', emoji: '🔧', color: G[0], desc: '新机上门安装调试' },
  { id: 'remove', name: '拆机', emoji: '🪛', color: G[3], desc: '设备拆除回收' },
  { id: 'move', name: '迁机', emoji: '🚚', color: G[2], desc: '搬家迁移设备' },
  { id: 'return', name: '返库', emoji: '📦', color: G[7], desc: '设备返厂入库' },
  { id: 'repair', name: '维修', emoji: '🛠️', color: G[5], desc: '故障维修保修' },
  { id: 'maintain', name: '保养', emoji: '🧽', color: G[1], desc: '滤芯更换保养' },
];
const wxWorkOrders = [
  { id: 'GD20240601', type: '装机', typeEmoji: '🔧', status: 4, statusText: '已完成', device: '净享 R800 Pro', address: '杭州市西湖区文一西路 100 号', time: '2024-06-01 14:30', fee: 0, color: G[0], master: { name: '王师傅', phone: '139****1234', rating: 4.9, jobs: 1280 }, timeline: [{ text: '提交预约', time: '06-01 09:12', done: true }, { text: '已派单 · 王师傅', time: '06-01 09:40', done: true }, { text: '师傅上门中', time: '06-01 13:55', done: true }, { text: '开始服务', time: '06-01 14:30', done: true }, { text: '服务完成', time: '06-01 15:20', done: true }] },
  { id: 'GD20240612', type: '维修', typeEmoji: '🛠️', status: 2, statusText: '上门中', device: '净享 U5 超滤直饮机', address: '杭州市余杭区五常大道 8 号', time: '2024-06-12 10:00', fee: 80, color: G[5], master: { name: '李师傅', phone: '137****5678', rating: 4.8, jobs: 960 }, timeline: [{ text: '提交预约', time: '06-11 18:30', done: true }, { text: '已派单 · 李师傅', time: '06-11 19:10', done: true }, { text: '师傅上门中', time: '06-12 09:30', done: true }, { text: '开始服务', time: '', done: false }, { text: '服务完成', time: '', done: false }] },
  { id: 'GD20240615', type: '保养', typeEmoji: '🧽', status: 1, statusText: '已派单', device: '净享 R600', address: '杭州市滨江区江南大道 28 号', time: '2024-06-16 15:00', fee: 50, color: G[1], master: { name: '赵师傅', phone: '135****9012', rating: 4.7, jobs: 720 }, timeline: [{ text: '提交预约', time: '06-15 20:05', done: true }, { text: '已派单 · 赵师傅', time: '06-15 20:30', done: true }, { text: '师傅上门中', time: '', done: false }, { text: '开始服务', time: '', done: false }, { text: '服务完成', time: '', done: false }] },
  { id: 'GD20240616', type: '迁机', typeEmoji: '🚚', status: 0, statusText: '待派单', device: '净享 R400', address: '杭州市拱墅区莫干山路 50 号', time: '2024-06-18 09:00', fee: 120, color: G[2], master: null, timeline: [{ text: '提交预约', time: '06-16 08:15', done: true }, { text: '等待派单', time: '', done: false }, { text: '师傅上门中', time: '', done: false }, { text: '开始服务', time: '', done: false }, { text: '服务完成', time: '', done: false }] },
];
const wxOrders = [
  { id: 'DD202406160001', status: 0, statusText: '待付款', items: [{ id: 1, title: '净享 R600 反渗透净水器', spec: '标准版（含基础安装）', price: 2680, count: 1, color: G[0], emoji: '💧' }], total: 2680, freight: 0, address: { name: '张净享', phone: '138****8888', detail: '杭州市西湖区文一西路100号' }, createTime: '2024-06-16 08:30', logistics: [], install: '' },
  { id: 'DD202406150002', status: 1, statusText: '待发货', items: [{ id: 4, title: 'PP棉+活性炭复合滤芯', spec: '标准版', price: 128, count: 2, color: G[3], emoji: '🧴' }, { id: 5, title: 'RO反渗透膜滤芯', spec: '标准版', price: 398, count: 1, color: G[6], emoji: '🧪' }], total: 654, freight: 0, address: { name: '张净享', phone: '138****8888', detail: '杭州市西湖区文一西路100号' }, createTime: '2024-06-15 19:20', logistics: [{ text: '已下单，等待商家发货', time: '06-15 19:25' }], install: '' },
  { id: 'DD202406120003', status: 2, statusText: '待安装', items: [{ id: 2, title: '净享 R800 Pro 旗舰版', spec: '尊享版（含3年滤芯）', price: 3980, count: 1, color: G[2], emoji: '🚰' }], total: 3980, freight: 0, address: { name: '张净享', phone: '138****8888', detail: '杭州市余杭区五常大道8号' }, createTime: '2024-06-12 11:00', logistics: [{ text: '已签收，等待预约安装', time: '06-13 16:40' }, { text: '杭州中转站已发出', time: '06-13 08:10' }, { text: '商品已发货', time: '06-12 14:30' }], install: '已预约 06-18 09:00 · 王师傅上门安装' },
  { id: 'DD202405200004', status: 3, statusText: '已完成', items: [{ id: 3, title: '净享 U5 超滤直饮机', spec: '标准版', price: 1280, count: 1, color: G[4], emoji: '💦' }], total: 1280, freight: 0, address: { name: '张净享', phone: '138****8888', detail: '杭州市滨江区江南大道28号' }, createTime: '2024-05-20 10:15', logistics: [{ text: '已完成安装，感谢使用', time: '05-22 15:00' }, { text: '师傅上门安装中', time: '05-22 14:00' }, { text: '商品已签收', time: '05-21 17:20' }], install: '已完成 05-22 14:00 · 李师傅上门安装' },
];
const wxOrderTabs = [
  { id: -1, name: '全部' }, { id: 0, name: '待付款' }, { id: 1, name: '待发货' }, { id: 2, name: '待安装' }, { id: 3, name: '已完成' },
];
const wxDistribution = {
  level: '合伙人', levelDesc: '链动2+1模式 · 享全级佣金', totalCommission: 12860.5, withdrawable: 3280.0,
  teamCount: 86, todayIncome: 168.0, directCount: 12, indirectCount: 74,
  levels: [
    { name: '普通会员', cond: '注册即享', rate: '直推 5%', emoji: '🌱' },
    { name: 'VIP会员', cond: '消费满 2000', rate: '直推 10% + 间推 3%', emoji: '⭐' },
    { name: '合伙人', cond: '团队满 50 人', rate: '直推 15% + 间推 8% + 平级奖', emoji: '👑' },
  ],
  incomeList: [
    { id: 1, name: '李** 购买 R800 Pro', type: '直推佣金', amount: 597.0, time: '06-16 10:32' },
    { id: 2, name: '王** 充值 1000 元', type: '间推佣金', amount: 30.0, time: '06-15 16:08' },
    { id: 3, name: '陈** 购买滤芯套装', type: '直推佣金', amount: 59.7, time: '06-15 09:21' },
    { id: 4, name: '团队 张** 升级合伙人', type: '平级奖励', amount: 200.0, time: '06-14 20:45' },
    { id: 5, name: '刘** 购买 U5 直饮机', type: '直推佣金', amount: 192.0, time: '06-13 14:12' },
    { id: 6, name: '赵** 购买管线机', type: '间推佣金', amount: 47.4, time: '06-12 11:30' },
  ],
  team: [
    { id: 1, name: '李明轩', avatar: '😀', level: 'VIP会员', type: '直推', contribution: 2680, time: '2024-03-12' },
    { id: 2, name: '王雅婷', avatar: '😎', level: '合伙人', type: '直推', contribution: 8900, time: '2024-02-08' },
    { id: 3, name: '陈思远', avatar: '🤓', level: '普通会员', type: '间推', contribution: 654, time: '2024-05-20' },
    { id: 4, name: '刘梓涵', avatar: '🥰', level: 'VIP会员', type: '直推', contribution: 3980, time: '2024-04-15' },
    { id: 5, name: '赵子轩', avatar: '😇', level: '普通会员', type: '间推', contribution: 1580, time: '2024-05-30' },
    { id: 6, name: '孙若曦', avatar: '🤩', level: 'VIP会员', type: '间推', contribution: 2280, time: '2024-04-22' },
  ],
};
const wxRechargePackages = [
  { id: 1, amount: 100, gift: 0, label: '' },
  { id: 2, amount: 300, gift: 20, label: '送20' },
  { id: 3, amount: 500, gift: 50, label: '送50' },
  { id: 4, amount: 1000, gift: 150, label: '送150', hot: true },
  { id: 5, amount: 2000, gift: 400, label: '送400' },
  { id: 6, amount: 5000, gift: 1200, label: '送1200' },
];
const wxAddresses = [
  { id: 1, name: '张净享', phone: '138****8888', region: '浙江省 杭州市 西湖区', detail: '文一西路100号阿里巴巴西溪园区A栋', tag: '家', isDefault: true },
  { id: 2, name: '张净享', phone: '138****8888', region: '浙江省 杭州市 余杭区', detail: '五常大道8号未来科技城B座', tag: '公司', isDefault: false },
  { id: 3, name: '李女士', phone: '137****6666', region: '浙江省 杭州市 滨江区', detail: '江南大道28号网商大厦', tag: '父母', isDefault: false },
];
const wxMyGrids = [
  { id: 'device', name: '我的设备', emoji: '📟', url: '/pages/device/list' },
  { id: 'order', name: '我的订单', emoji: '📋', url: '/pages/order/list' },
  { id: 'work', name: '我的工单', emoji: '🧰', url: '/pages/service/service', tab: true },
  { id: 'dist', name: '分销中心', emoji: '💰', url: '/pages/distribution/index' },
  { id: 'recharge', name: '充值', emoji: '💳', url: '/pages/recharge/recharge' },
  { id: 'address', name: '地址管理', emoji: '📍', url: '/pages/address/list' },
  { id: 'cart', name: '购物车', emoji: '🛒', url: '/pages/cart/cart' },
  { id: 'service', name: '客服', emoji: '🎧', url: '' },
];

// 默认系统设置 / 页面装修（供 GET 返回，前端可改）
const systemSettings = {
  base: { siteName: '德康泉管理系统', logo: '泉', contact: '400-888-6666', desc: '德康泉净水上门服务、商城、物联网设备管理一体化平台' },
  iot: { baseUrl: 'https://iot.example.com', appKey: 'jsq_iot_app_key_2026', appSecret: '****************', syncInterval: 5 },
  wx: { appid: 'wx1234567890abcdef', secret: '****************', mchId: '1600000000' },
  security: { loginVerify: true, ipWhitelist: false, pwdExpire: 90 },
};
const pageConfigDefault = {
  components: [
    { id: 1, type: 'banner', props: { images: ['蓝色海报', '青色海报', '橙色海报'], height: 150 } },
    { id: 2, type: 'nav', props: { cols: 4, items: ['商城', '装机预约', '我的设备', '分销中心', '充值', '维修', '水质检测', '全部'] } },
    { id: 3, type: 'goods', props: { title: '推荐商品', cols: 2, count: 4 } },
  ],
  pageConfig: { title: '德康泉首页', bgColor: '#f5f7fa' },
};

// ============================================================
// 三、补齐脑图功能的新增数据
// ============================================================

// ---- 排行榜激励：销售榜/收益榜 × 个人/团队 × 月/季/年 ----
const rankNames = ['王建国', '李秀英', '张伟', '陈明', '刘洋', '赵丽', '孙强', '周敏', '吴磊', '郑华'];
const rankAreas = ['西湖区', '拱墅区', '余杭区', '滨江区', '海曙区', '鹿城区'];
const rankings: any[] = [];
let _rid = 1;
for (const board of ['sales', 'profit']) {
  for (const scope of ['personal', 'team']) {
    for (const period of ['month', 'quarter', 'year']) {
      const mul = period === 'month' ? 1 : period === 'quarter' ? 3 : 12;
      rankNames.forEach((name, i) => {
        const base = board === 'sales' ? 86 : 12000;
        const value = +((base * (10 - i) * mul) * (board === 'sales' ? 1 : 1)).toFixed(board === 'sales' ? 0 : 2);
        rankings.push({
          id: _rid++, board, scope, period, rank: i + 1,
          name: scope === 'team' ? `${name}战队` : name,
          avatar: name[0], area: rankAreas[i % rankAreas.length],
          value, trend: ((i * 7) % 5) - 2,
        });
      });
    }
  }
}

// ---- 营销-积分：规则 + 明细 ----
const pointRules = [
  { id: 1, name: '注册奖励', event: 'register', points: 100, desc: '新用户注册即送 100 积分', enabled: true },
  { id: 2, name: '每日签到', event: 'sign', points: 5, desc: '每日签到获得 5 积分', enabled: true },
  { id: 3, name: '消费奖励', event: 'order', points: 1, desc: '每消费 1 元得 1 积分', enabled: true },
  { id: 4, name: '充值奖励', event: 'recharge', points: 2, desc: '每充值 1 元得 2 积分', enabled: true },
  { id: 5, name: '邀请好友', event: 'invite', points: 200, desc: '成功邀请 1 位好友得 200 积分', enabled: true },
  { id: 6, name: '评价晒单', event: 'review', points: 20, desc: '完成评价晒单得 20 积分', enabled: false },
];
const pointRecords = Array.from({ length: 24 }).map((_, i) => {
  const earn = i % 3 !== 0;
  return {
    id: 'PT' + String(20260616000 + i),
    customer: custNames[i % custNames.length],
    phone: '138' + String(10000000 + i * 137).slice(0, 8),
    type: earn ? 'earn' : 'spend',
    points: earn ? [5, 100, 20, 200][i % 4] : [50, 100, 200][i % 3],
    reason: earn ? ['每日签到', '注册奖励', '评价晒单', '邀请好友'][i % 4] : ['积分兑换滤芯', '积分抵现', '兑换优惠券'][i % 3],
    balance: 500 + ((i * 37) % 2000),
    time: `2026-06-${String(16 - (i % 16)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:30`,
  };
});

// ---- 库存管理：库存 + 出入库记录 ----
const invNames = [
  ['JSQ-R600 整机', 'SKU-R600', 'JSQ-R600', '净水器整机', '台'],
  ['JSQ-R800 Pro 整机', 'SKU-R800', 'JSQ-R800 Pro', '净水器整机', '台'],
  ['PP棉滤芯', 'SKU-PP01', '通用', '滤芯耗材', '支'],
  ['活性炭滤芯', 'SKU-AC01', '通用', '滤芯耗材', '支'],
  ['RO反渗透膜', 'SKU-RO01', '通用', '滤芯耗材', '支'],
  ['前置过滤器', 'SKU-PRE1', 'JSQ-Q3', '前置过滤器', '台'],
  ['管线机 G5', 'SKU-G5', 'JSQ-G5', '管线机', '台'],
  ['水龙头配件', 'SKU-FT01', '通用', '配件附件', '个'],
];
const inventory = invNames.map((it, i) => ({
  id: i + 1, name: it[0], sku: it[1], model: it[2], category: it[3], unit: it[4],
  stock: [120, 86, 540, 480, 320, 64, 28, 760][i],
  warnLine: [20, 20, 100, 100, 80, 15, 10, 100][i],
  location: `${'ABC'[i % 3]}区-${(i % 5) + 1}号货架`,
  updateTime: `2026-06-${String(16 - (i % 10)).padStart(2, '0')} 10:00`,
}));
const stockLogs = Array.from({ length: 18 }).map((_, i) => {
  const it = invNames[i % invNames.length];
  return {
    id: 'STK' + String(20260616000 + i),
    sku: it[1], name: it[0], type: i % 2 === 0 ? 'in' : 'out',
    qty: 10 + ((i * 7) % 90), operator: ['仓管员张三', '仓管员李四'][i % 2],
    remark: i % 2 === 0 ? '采购入库' : '工单领用出库',
    time: `2026-06-${String(16 - (i % 16)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:15`,
  };
});

// ---- 系统：角色 / 账号 / 操作日志 / 站内消息 ----
const ALL_PERMS = ['dashboard', 'mall', 'device', 'workorder', 'distribution', 'customer', 'recharge', 'inventory', 'marketing', 'ranking', 'system'];
const roles = [
  { id: 1, name: '超级管理员', code: 'super', permissions: ALL_PERMS, desc: '拥有全部权限', status: 'enabled', createTime: '2026-01-01' },
  { id: 2, name: '运营管理员', code: 'operator', permissions: ['dashboard', 'mall', 'recharge', 'marketing', 'ranking', 'customer'], desc: '负责商城与营销运营', status: 'enabled', createTime: '2026-01-02' },
  { id: 3, name: '客服专员', code: 'service', permissions: ['dashboard', 'workorder', 'customer'], desc: '负责工单与客户服务', status: 'enabled', createTime: '2026-01-03' },
  { id: 4, name: '仓库管理员', code: 'warehouse', permissions: ['dashboard', 'inventory', 'device'], desc: '负责库存与设备', status: 'enabled', createTime: '2026-01-04' },
];
const accounts = [
  { id: 'U001', username: 'admin', name: '系统管理员', roleCode: 'super', role: '超级管理员', phone: '13800000000', status: 'enabled', lastLogin: '2026-06-16 09:00', createTime: '2026-01-01' },
  { id: 'U002', username: 'yunying', name: '王运营', roleCode: 'operator', role: '运营管理员', phone: '13800000001', status: 'enabled', lastLogin: '2026-06-15 18:20', createTime: '2026-02-10' },
  { id: 'U003', username: 'kefu01', name: '李客服', roleCode: 'service', role: '客服专员', phone: '13800000002', status: 'enabled', lastLogin: '2026-06-16 08:40', createTime: '2026-03-05' },
  { id: 'U004', username: 'cangku', name: '张仓管', roleCode: 'warehouse', role: '仓库管理员', phone: '13800000003', status: 'disabled', lastLogin: '2026-06-10 17:00', createTime: '2026-03-20' },
];
const opLogs = Array.from({ length: 20 }).map((_, i) => ({
  id: 'LOG' + String(20260616000 + i),
  user: ['系统管理员', '王运营', '李客服', '张仓管'][i % 4],
  module: ['商城管理', '工单管理', '分销管理', '库存管理', '系统设置'][i % 5],
  action: ['新增商品', '派单', '审核提现', '入库操作', '修改角色权限'][i % 5],
  ip: `192.168.1.${10 + (i % 200)}`,
  detail: `操作对象 ID #${1000 + i}`,
  time: `2026-06-${String(16 - (i % 16)).padStart(2, '0')} ${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
}));
const notices = Array.from({ length: 10 }).map((_, i) => ({
  id: 'MSG' + String(20260616000 + i),
  title: ['新订单提醒', '工单超时预警', '提现待审核', '滤芯库存不足', '系统维护通知'][i % 5],
  content: ['您有一笔新订单待处理', '工单 WO20260616 已超时', '有 3 笔提现申请待审核', 'PP棉滤芯库存低于预警线', '系统将于今晚 23:00 维护'][i % 5],
  type: ['order', 'alert', 'system', 'alert', 'system'][i % 5],
  target: '全体管理员', status: i < 4 ? 'unread' : 'read',
  time: `2026-06-${String(16 - (i % 10)).padStart(2, '0')} ${String(8 + i % 10).padStart(2, '0')}:00`,
}));

// ---- 消息通知模板 ----
const msgTemplates = [
  { id: 1, name: '订单支付成功', scene: 'order_paid', channel: 'wx', content: '尊敬的{customer}，您的订单{orderId}已支付成功，金额{amount}元。', status: 'enabled' },
  { id: 2, name: '工单派单通知', scene: 'workorder_dispatch', channel: 'sms', content: '【德康泉】{technician}师傅已接单，将于{appointTime}上门服务。', status: 'enabled' },
  { id: 3, name: '滤芯到期提醒', scene: 'filter_expire', channel: 'wx', content: '您的设备{deviceSn}滤芯寿命仅剩{filterLife}%，请及时更换。', status: 'enabled' },
  { id: 4, name: '续费到期提醒', scene: 'renew_expire', channel: 'sms', content: '【德康泉】您的水站套餐将于{date}到期，请及时续费。', status: 'enabled' },
  { id: 5, name: '充值成功通知', scene: 'recharge_success', channel: 'wx', content: '充值成功！本次到账{amount}元，赠送{gift}元。', status: 'enabled' },
  { id: 6, name: '提现审核结果', scene: 'withdraw_audit', channel: 'site', content: '您的提现申请{amount}元已{status}。', status: 'disabled' },
];

// ---- 师傅入驻审核 ----
const techApplies = Array.from({ length: 8 }).map((_, i) => ({
  id: 'TA' + String(20260616000 + i),
  name: ['周师傅', '吴师傅', '郑师傅', '冯师傅', '陈师傅', '褚师傅', '卫师傅', '蒋师傅'][i],
  phone: '139' + String(20000000 + i * 271).slice(0, 8),
  area: rankAreas[i % rankAreas.length],
  idcard: `3301**********${String(1000 + i).slice(0, 4)}`,
  experience: ['3年净水器安装', '5年家电维修', '2年管道工', '8年水电安装'][i % 4],
  status: i < 4 ? 'pending' : i < 6 ? 'approved' : 'rejected',
  applyTime: `2026-06-${String(16 - i).padStart(2, '0')} ${String(10 + i % 8).padStart(2, '0')}:20`,
  remark: i >= 6 ? '资质不符' : '',
}));

// ---- 设备：故障记录 / 校准记录 / 制水记录 ----
const deviceFaults = Array.from({ length: 14 }).map((_, i) => ({
  id: 'FT' + String(20260616000 + i),
  deviceSn: 'SN' + String(100001 + i),
  model: ['JSQ-R600', 'JSQ-R800 Pro', 'JSQ-G5'][i % 3],
  customer: custNames[i % custNames.length],
  faultType: ['制水异常', '漏水', 'TDS超标', '不出水', '噪音过大'][i % 5],
  level: ['high', 'mid', 'low'][i % 3],
  desc: ['制水量明显下降', '机身底部渗水', '出水TDS高于100', '完全无法出水', '运行噪音异常'][i % 5],
  status: ['pending', 'handling', 'resolved'][i % 3],
  time: `2026-06-${String(16 - (i % 14)).padStart(2, '0')} ${String(8 + i % 10).padStart(2, '0')}:10`,
}));
const deviceCalibrations = Array.from({ length: 12 }).map((_, i) => {
  const after = 18 + (i % 12);
  return {
    id: 'CAL' + String(20260616000 + i),
    deviceSn: 'SN' + String(100001 + i),
    model: ['JSQ-R600', 'JSQ-R800 Pro', 'JSQ-G5'][i % 3],
    tdsBefore: 40 + (i % 30), tdsAfter: after,
    operator: ['赵师傅', '钱师傅', '孙师傅'][i % 3],
    result: after <= 50 ? 'pass' : 'fail',
    time: `2026-06-${String(16 - (i % 12)).padStart(2, '0')} ${String(9 + i % 8).padStart(2, '0')}:30`,
  };
});
const waterRecords = Array.from({ length: 20 }).map((_, i) => ({
  id: 'WR' + String(20260616000 + i),
  deviceSn: 'SN' + String(100001 + (i % 14)),
  customer: custNames[i % custNames.length],
  date: `2026-06-${String(16 - (i % 16)).padStart(2, '0')}`,
  water: +(20 + ((i * 13) % 80) + Math.floor(i / 4)).toFixed(1),
  tds: 15 + (i % 20), inTds: 180 + (i % 120),
}));

// ---- 在线客服会话 ----
const chatSessions = Array.from({ length: 8 }).map((_, i) => ({
  id: 'CS' + String(20260616000 + i),
  customer: custNames[i % custNames.length],
  phone: '137' + String(30000000 + i * 311).slice(0, 8),
  avatar: custNames[i % custNames.length][0],
  lastMsg: ['请问滤芯多久换一次？', '我的设备不出水了', '可以预约上门吗', '充值优惠还有吗', '谢谢，已解决'][i % 5],
  unread: i < 3 ? (i + 1) : 0,
  status: i < 6 ? 'open' : 'closed',
  updateTime: `2026-06-16 ${String(9 + i).padStart(2, '0')}:${String((i * 9) % 60).padStart(2, '0')}`,
  messages: [
    { from: 'customer', text: ['请问滤芯多久换一次？', '我的设备不出水了', '可以预约上门吗'][i % 3], time: '09:30' },
    { from: 'agent', text: '您好，已为您查询，正在处理中~', time: '09:31' },
  ],
}));

// ---- 支付流水 ----
const paymentRecords = Array.from({ length: 20 }).map((_, i) => ({
  id: 'PAY' + String(20260616000 + i),
  orderId: (i % 2 === 0 ? 'OD' : 'RC') + String(20260616000 + i),
  customer: custNames[i % custNames.length],
  channel: ['wxpay', 'alipay', 'balance'][i % 3],
  amount: +(99 + ((i * 137) % 3000)).toFixed(2),
  type: i % 4 === 3 ? 'refund' : i % 2 === 0 ? 'order' : 'recharge',
  status: i % 7 === 6 ? 'refund' : i % 11 === 10 ? 'fail' : 'success',
  time: `2026-06-${String(16 - (i % 16)).padStart(2, '0')} ${String(8 + i % 12).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
}));

// ---- 商品套餐（组合套餐） ----
const packages = [
  { id: 1, name: '净水器整机+年度滤芯套餐', items: ['JSQ-R600 整机 ×1', 'PP棉滤芯 ×2', '活性炭滤芯 ×2', 'RO膜 ×1'], price: 2980, originPrice: 3680, sales: 326, status: 'enabled', desc: '一站式购齐，省心一整年' },
  { id: 2, name: '滤芯年度更换套餐', items: ['PP棉滤芯 ×2', '活性炭滤芯 ×2', 'RO膜 ×1'], price: 680, originPrice: 880, sales: 512, status: 'enabled', desc: '全年滤芯一次配齐' },
  { id: 3, name: '前置+管线机组合', items: ['前置过滤器 ×1', '管线机 G5 ×1'], price: 1880, originPrice: 2380, sales: 168, status: 'enabled', desc: '入户净水升级方案' },
  { id: 4, name: '新装尝鲜套餐', items: ['JSQ-U400 整机 ×1', '安装服务 ×1'], price: 1599, originPrice: 1999, sales: 86, status: 'disabled', desc: '含上门安装' },
];

// ---- 分销-区域分红 ----
const regionDividends = rankAreas.map((region, i) => ({
  id: 'RD' + String(100 + i),
  region, manager: rankNames[i], level: ['钻石', '金牌', '银牌'][i % 3],
  memberCount: 120 - i * 12, dividendRate: [5, 4, 3][i % 3],
  monthAmount: +(28600 - i * 3200).toFixed(2), totalAmount: +(286000 - i * 32000).toFixed(2),
  status: 'enabled',
}));

// ---- 续费统计（聚合指标） ----
const renewalData = {
  trend: { months: ['1月', '2月', '3月', '4月', '5月', '6月'], count: [180, 210, 240, 260, 300, 340], rate: [62, 65, 68, 70, 72, 75] },
  byPackage: [{ name: '月卡续费', value: 680 }, { name: '季卡续费', value: 420 }, { name: '年卡续费', value: 520 }, { name: '两年卡续费', value: 160 }],
  byArea: [{ name: '西湖区', value: 320 }, { name: '拱墅区', value: 260 }, { name: '余杭区', value: 220 }, { name: '滨江区', value: 180 }, { name: '海曙区', value: 120 }],
  summary: { renewCount: 1780, renewAmount: 1286000, renewRate: 72.4, expireSoon: 86 },
  table: Array.from({ length: 12 }).map((_, i) => ({
    date: `2026-06-${String(16 - i).padStart(2, '0')}`,
    customer: custNames[i % custNames.length],
    package: ['月卡套餐', '季卡套餐', '年卡套餐'][i % 3],
    amount: +(99 + ((i * 137) % 1200)).toFixed(2),
    nextExpire: `2026-${String(7 + (i % 6)).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`,
  })),
};

// ---- 分销体系配置（链动2+1 / 直推 / 邀请 / 阶梯 / 区域分红） ----
const distSystemConfig = {
  chain21: { enabled: true, autoUpgrade: true, desc: '链动2+1：推荐2人复购，第3人升级为团队长，享团队分红' },
  directReward: { enabled: true, rate: 15, desc: '直推奖励：直接推荐成交，奖励订单金额 15%' },
  inviteReward: { enabled: true, amount: 200, pointsAmount: 200, desc: '邀请奖励：每成功邀请 1 位实名好友奖励 200 元 + 200 积分' },
  ladder: { enabled: true, levels: [
    { level: '普通会员', condition: '注册即可', directRate: 10, teamRate: 0 },
    { level: '银牌会员', condition: '团队≥10人', directRate: 12, teamRate: 3 },
    { level: '金牌会员', condition: '团队≥50人', directRate: 15, teamRate: 5 },
    { level: '钻石会员', condition: '团队≥200人', directRate: 18, teamRate: 8 },
  ] },
  regionDividend: { enabled: true, desc: '区域分红：区域代理按辖区业绩享 3%~5% 区域分红' },
};

// ============================================================
// 执行入库
// ============================================================
async function run() {
  const ds = new DataSource({ ...dataSourceOptions, entities: ALL_ENTITIES, synchronize: true });
  await ds.initialize();
  console.log('✓ 数据库已连接，重建表结构...');
  await ds.synchronize(true); // 删表重建，保证可重复执行

  await ds.getRepository(AdminCategory).save(categories);
  await ds.getRepository(AdminProduct).save(products);
  await ds.getRepository(AdminOrder).save(orders);
  await ds.getRepository(AdminDevice).save(devices);
  await ds.getRepository(AdminDeviceModel).save(deviceModels);
  await ds.getRepository(AdminWorkorder).save(workorders);
  await ds.getRepository(AdminTechnician).save(technicians);
  await ds.getRepository(AdminCustomer).save(customers);
  await ds.getRepository(AdminDistributor).save(distributors);
  await ds.getRepository(AdminCommission).save(commissions);
  await ds.getRepository(AdminWithdrawal).save(withdrawals);
  await ds.getRepository(AdminDistRule).save(distRules);
  await ds.getRepository(AdminAlert).save(alerts);
  await ds.getRepository(AdminAlertRule).save(alertRules);
  await ds.getRepository(AdminRechargePackage).save(rechargePackages);
  await ds.getRepository(AdminRechargeRecord).save(rechargeRecords);
  console.log('✓ 管理后台业务表写入完成');

  // ---- 补齐脑图功能的新增表 ----
  await ds.getRepository(AdminRanking).save(rankings);
  await ds.getRepository(AdminPointRule).save(pointRules);
  await ds.getRepository(AdminPointRecord).save(pointRecords);
  await ds.getRepository(AdminInventory).save(inventory);
  await ds.getRepository(AdminStockLog).save(stockLogs);
  await ds.getRepository(AdminRole).save(roles);
  await ds.getRepository(AdminAccount).save(accounts);
  await ds.getRepository(AdminOpLog).save(opLogs);
  await ds.getRepository(AdminNotice).save(notices);
  await ds.getRepository(AdminMsgTemplate).save(msgTemplates);
  await ds.getRepository(AdminTechApply).save(techApplies);
  await ds.getRepository(AdminDeviceFault).save(deviceFaults);
  await ds.getRepository(AdminDeviceCalibration).save(deviceCalibrations);
  await ds.getRepository(AdminWaterRecord).save(waterRecords);
  await ds.getRepository(AdminChatSession).save(chatSessions);
  await ds.getRepository(AdminPaymentRecord).save(paymentRecords);
  await ds.getRepository(AdminPackage).save(packages);
  await ds.getRepository(AdminRegionDividend).save(regionDividends);
  console.log('✓ 新增业务表写入完成');

  await ds.getRepository(WxProduct).save(wxProducts);
  await ds.getRepository(WxDevice).save(wxDevices);
  await ds.getRepository(WxWorkorder).save(wxWorkOrders as any);
  await ds.getRepository(WxOrder).save(wxOrders as any);
  await ds.getRepository(WxAddress).save(wxAddresses);
  console.log('✓ 小程序业务表写入完成');

  const metric = ds.getRepository(Metric);
  const metrics: Array<[string, any]> = [
    ['dashboard.statCards', statCards],
    ['dashboard.revenueTrend', revenueTrend],
    ['dashboard.workorderStatus', workorderStatus],
    ['dashboard.todoList', todoList],
    ['dashboard.latestWorkorders', latestWorkorders],
    ['data.install', installData],
    ['data.recharge', rechargeAnalysis],
    ['data.customer', customerAnalysis],
    ['data.screen', screenData],
    ['data.renewal', renewalData],
    ['distribution.overview', distOverview],
    ['distribution.system', distSystemConfig],
    ['recharge.trend', rechargeTrend],
    ['system.settings', systemSettings],
    ['page.config', pageConfigDefault],
    ['wx.banners', wxBanners],
    ['wx.grids', wxGrids],
    ['wx.categories', wxCategories],
    ['wx.serviceTypes', wxServiceTypes],
    ['wx.orderTabs', wxOrderTabs],
    ['wx.myGrids', wxMyGrids],
    ['wx.waterChart', wxWaterChart],
    ['wx.distribution', wxDistribution],
    ['wx.rechargePackages', wxRechargePackages],
    ['wx.productSpecs', wxProductSpecs],
  ];
  for (const [key, data] of metrics) {
    await metric.save({ key, data });
  }
  console.log(`✓ 聚合指标写入完成 (${metrics.length} 项)`);

  await ds.destroy();
  console.log('🎉 数据填充完成！');
}

run().catch((e) => {
  console.error('❌ seed 失败:', e);
  process.exit(1);
});
