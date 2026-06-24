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
