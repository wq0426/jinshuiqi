import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

// ============ 商城 ============
@Entity('admin_category')
export class AdminCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() sort: number;
  @Column({ default: 0 }) count: number;
}

@Entity('admin_product')
export class AdminProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column({ type: 'text' }) image: string;
  @Column() categoryId: number;
  @Column() category: string;
  @Column({ type: 'double' }) price: number;
  @Column({ type: 'double' }) originPrice: number;
  @Column() stock: number;
  @Column() sales: number;
  @Column() onSale: boolean;
  @Column() sort: number;
  @Column() createTime: string;
}

@Entity('admin_order')
export class AdminOrder {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() customer: string;
  @Column() phone: string;
  @Column({ type: 'text' }) address: string;
  @Column({ type: 'json' }) items: any;
  @Column({ type: 'double' }) amount: number;
  @Column({ type: 'double' }) payAmount: number;
  @Column() status: string;
  @Column() payType: string;
  @Column() createTime: string;
  @Column({ type: 'json' }) logistics: any;
}

// ============ 设备 ============
@Entity('admin_device')
export class AdminDevice {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() sn: string;
  @Column() model: string;
  @Column() customer: string;
  @Column() phone: string;
  @Column() area: string;
  @Column() online: boolean;
  @Column() filterLife: number;
  @Column() tds: number;
  @Column() inTds: number;
  @Column({ type: 'double' }) waterToday: number;
  @Column({ type: 'double' }) waterTotal: number;
  @Column() temperature: number;
  @Column() lastReport: string;
  @Column() installDate: string;
  @Column() power: boolean;
  @Column() flushing: boolean;
  @Column({ type: 'json' }) waterCurve: any;
}

@Entity('admin_device_model')
export class AdminDeviceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() type: string;
  @Column() capacity: string;
  @Column() filters: number;
  @Column({ type: 'double' }) price: number;
  @Column() status: string;
  @Column() count: number;
}

// ============ 工单 ============
@Entity('admin_workorder')
export class AdminWorkorder {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() type: string;
  @Column() status: string;
  @Column() customer: string;
  @Column() phone: string;
  @Column({ type: 'text' }) address: string;
  @Column() deviceModel: string;
  @Column() deviceSn: string;
  @Column({ default: '' }) technician: string;
  @Column() createTime: string;
  @Column() appointTime: string;
  @Column({ type: 'text', nullable: true }) remark: string;
  @Column({ type: 'json' }) timeline: any;
  @Column({ type: 'json' }) photos: any;
}

@Entity('admin_technician')
export class AdminTechnician {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() name: string;
  @Column() phone: string;
  @Column() area: string;
  @Column() online: boolean;
  @Column({ type: 'double' }) rating: number;
  @Column() ongoing: number;
  @Column() totalOrders: number;
  @Column() level: string;
  @Column() joinDate: string;
}

// ============ 分销 ============
@Entity('admin_distributor')
export class AdminDistributor {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() name: string;
  @Column() phone: string;
  @Column() level: string;
  @Column() parent: string;
  @Column() teamSize: number;
  @Column() directCount: number;
  @Column({ type: 'double' }) totalCommission: number;
  @Column({ type: 'double' }) monthCommission: number;
  @Column() joinDate: string;
}

@Entity('admin_commission')
export class AdminCommission {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() distributor: string;
  @Column() type: string;
  @Column() orderId: string;
  @Column({ type: 'double' }) amount: number;
  @Column() rate: string;
  @Column() status: string;
  @Column() time: string;
}

@Entity('admin_withdrawal')
export class AdminWithdrawal {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() distributor: string;
  @Column() phone: string;
  @Column({ type: 'double' }) amount: number;
  @Column() account: string;
  @Column() accountNo: string;
  @Column() status: string;
  @Column() applyTime: string;
  @Column({ type: 'text', nullable: true }) remark: string;
}

@Entity('admin_dist_rule')
export class AdminDistRule {
  @PrimaryColumn()
  id: number;

  @Column() level: string;
  @Column() directRate: number;
  @Column() indirectRate: number;
  @Column() upCondition: string;
  @Column() enabled: boolean;
}

// ============ 客户 ============
@Entity('admin_customer')
export class AdminCustomer {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() name: string;
  @Column() nickname: string;
  @Column() phone: string;
  @Column() area: string;
  @Column({ type: 'double' }) balance: number;
  @Column() points: number;
  @Column() level: string;
  @Column() deviceCount: number;
  @Column() orderCount: number;
  @Column() registerDate: string;
  @Column() lastActive: string;
  @Column({ type: 'json' }) devices: any;
  @Column({ type: 'json' }) orders: any;
  @Column({ type: 'json' }) workorders: any;
}

// ============ 充值 ============
@Entity('admin_recharge_package')
export class AdminRechargePackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column({ type: 'double' }) amount: number;
  @Column({ type: 'double' }) gift: number;
  @Column({ type: 'text' }) desc: string;
  @Column() sales: number;
  @Column() enabled: boolean;
  @Column({ default: '' }) tag: string;
}

@Entity('admin_recharge_record')
export class AdminRechargeRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() customer: string;
  @Column() phone: string;
  @Column({ name: 'package_name' }) package: string;
  @Column({ type: 'double' }) amount: number;
  @Column() payType: string;
  @Column() status: string;
  @Column() time: string;
}

// ============ 预警 ============
@Entity('admin_alert')
export class AdminAlert {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() type: string;
  @Column() level: string;
  @Column() target: string;
  @Column() customer: string;
  @Column({ type: 'text' }) desc: string;
  @Column() status: string;
  @Column() time: string;
}

@Entity('admin_alert_rule')
export class AdminAlertRule {
  @PrimaryColumn()
  id: number;

  @Column() type: string;
  @Column() threshold: number;
  @Column() unit: string;
  @Column({ type: 'text' }) desc: string;
  @Column() level: string;
  @Column() enabled: boolean;
}

// ============ 排行榜激励 ============
@Entity('admin_ranking')
export class AdminRanking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() board: string; // sales 销售榜 | profit 收益榜
  @Column() scope: string; // personal 个人 | team 团队
  @Column() period: string; // month | quarter | year
  @Column() rank: number;
  @Column() name: string;
  @Column({ default: '' }) avatar: string;
  @Column() area: string;
  @Column({ type: 'double' }) value: number;
  @Column({ default: 0 }) trend: number; // 名次变化，正为上升
}

// ============ 营销-积分 ============
@Entity('admin_point_rule')
export class AdminPointRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() event: string;
  @Column() points: number;
  @Column({ type: 'text' }) desc: string;
  @Column() enabled: boolean;
}

@Entity('admin_point_record')
export class AdminPointRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() customer: string;
  @Column() phone: string;
  @Column() type: string; // earn 获取 | spend 消耗
  @Column() points: number;
  @Column() reason: string;
  @Column() balance: number;
  @Column() time: string;
}

// ============ 库存管理 ============
@Entity('admin_inventory')
export class AdminInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() sku: string;
  @Column() model: string;
  @Column() category: string;
  @Column() stock: number;
  @Column() warnLine: number;
  @Column() location: string;
  @Column() unit: string;
  @Column() updateTime: string;
}

@Entity('admin_stock_log')
export class AdminStockLog {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() sku: string;
  @Column() name: string;
  @Column() type: string; // in 入库 | out 出库
  @Column() qty: number;
  @Column() operator: string;
  @Column({ type: 'text', nullable: true }) remark: string;
  @Column() time: string;
}

// ============ 系统-角色/账号/操作日志/消息通知 ============
@Entity('admin_role')
export class AdminRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() code: string;
  @Column({ type: 'json' }) permissions: any;
  @Column({ type: 'text' }) desc: string;
  @Column() status: string;
  @Column() createTime: string;
}

@Entity('admin_account')
export class AdminAccount {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() username: string;
  @Column() name: string;
  @Column() roleCode: string;
  @Column() role: string;
  @Column() phone: string;
  @Column() status: string;
  @Column({ default: '' }) lastLogin: string;
  @Column() createTime: string;
}

@Entity('admin_op_log')
export class AdminOpLog {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() user: string;
  @Column() module: string;
  @Column() action: string;
  @Column() ip: string;
  @Column({ type: 'text' }) detail: string;
  @Column() time: string;
}

@Entity('admin_notice')
export class AdminNotice {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() title: string;
  @Column({ type: 'text' }) content: string;
  @Column() type: string; // system 系统 | order 订单 | alert 预警
  @Column() target: string;
  @Column() status: string; // unread | read
  @Column() time: string;
}

// ============ 消息通知模板 ============
@Entity('admin_msg_template')
export class AdminMsgTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() scene: string;
  @Column() channel: string; // wx 微信 | sms 短信 | site 站内
  @Column({ type: 'text' }) content: string;
  @Column() status: string;
}

// ============ 师傅审核 ============
@Entity('admin_tech_apply')
export class AdminTechApply {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() name: string;
  @Column() phone: string;
  @Column() area: string;
  @Column() idcard: string;
  @Column() experience: string;
  @Column() status: string; // pending | approved | rejected
  @Column() applyTime: string;
  @Column({ type: 'text', nullable: true }) remark: string;
}

// ============ 设备-故障/校准/制水记录 ============
@Entity('admin_device_fault')
export class AdminDeviceFault {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() deviceSn: string;
  @Column() model: string;
  @Column() customer: string;
  @Column() faultType: string;
  @Column() level: string;
  @Column({ type: 'text' }) desc: string;
  @Column() status: string; // pending 待处理 | handling 处理中 | resolved 已解决
  @Column() time: string;
}

@Entity('admin_device_calibration')
export class AdminDeviceCalibration {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() deviceSn: string;
  @Column() model: string;
  @Column() tdsBefore: number;
  @Column() tdsAfter: number;
  @Column() operator: string;
  @Column() result: string; // pass 合格 | fail 不合格
  @Column() time: string;
}

@Entity('admin_water_record')
export class AdminWaterRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() deviceSn: string;
  @Column() customer: string;
  @Column() date: string;
  @Column({ type: 'double' }) water: number;
  @Column() tds: number;
  @Column() inTds: number;
}

// ============ 在线客服 ============
@Entity('admin_chat_session')
export class AdminChatSession {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() customer: string;
  @Column() phone: string;
  @Column({ default: '' }) avatar: string;
  @Column({ type: 'text' }) lastMsg: string;
  @Column() unread: number;
  @Column() status: string; // open 进行中 | closed 已结束
  @Column() updateTime: string;
  @Column({ type: 'json' }) messages: any;
}

// ============ 支付管理 ============
@Entity('admin_payment_record')
export class AdminPaymentRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() orderId: string;
  @Column() customer: string;
  @Column() channel: string; // wxpay | alipay | balance
  @Column({ type: 'double' }) amount: number;
  @Column() type: string; // order 订单 | recharge 充值 | refund 退款
  @Column() status: string; // success | refund | fail
  @Column() time: string;
}

// ============ 商品套餐 ============
@Entity('admin_package')
export class AdminPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column({ type: 'json' }) items: any;
  @Column({ type: 'double' }) price: number;
  @Column({ type: 'double' }) originPrice: number;
  @Column() sales: number;
  @Column() status: string;
  @Column({ type: 'text' }) desc: string;
}

// ============ 分销-区域分红 ============
@Entity('admin_region_dividend')
export class AdminRegionDividend {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() region: string;
  @Column() manager: string;
  @Column() level: string;
  @Column() memberCount: number;
  @Column() dividendRate: number;
  @Column({ type: 'double' }) monthAmount: number;
  @Column({ type: 'double' }) totalAmount: number;
  @Column() status: string;
}
