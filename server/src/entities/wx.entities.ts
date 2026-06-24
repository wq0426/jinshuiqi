import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wx_product')
export class WxProduct {
  @PrimaryColumn()
  id: number;

  @Column() cat: string;
  @Column() title: string;
  @Column({ type: 'text' }) desc: string;
  @Column({ type: 'double' }) price: number;
  @Column({ type: 'double' }) oldPrice: number;
  @Column() sales: number;
  @Column({ type: 'text' }) color: string;
  @Column() emoji: string;
  @Column({ type: 'json' }) tags: any;
}

@Entity('wx_device')
export class WxDevice {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() name: string;
  @Column() model: string;
  @Column() room: string;
  @Column() online: boolean;
  @Column() tdsIn: number;
  @Column() tdsOut: number;
  @Column({ type: 'text' }) color: string;
  @Column() emoji: string;
  @Column({ type: 'double' }) todayWater: number;
  @Column({ type: 'double' }) totalWater: number;
  @Column() power: boolean;
  @Column({ type: 'json' }) filters: any;
}

@Entity('wx_workorder')
export class WxWorkorder {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() type: string;
  @Column() typeEmoji: string;
  @Column() status: number;
  @Column() statusText: string;
  @Column() device: string;
  @Column({ type: 'text' }) address: string;
  @Column() time: string;
  @Column({ type: 'double' }) fee: number;
  @Column({ type: 'text' }) color: string;
  @Column({ type: 'json', nullable: true }) master: any;
  @Column({ type: 'json' }) timeline: any;
}

@Entity('wx_order')
export class WxOrder {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column() status: number;
  @Column() statusText: string;
  @Column({ type: 'json' }) items: any;
  @Column({ type: 'double' }) total: number;
  @Column({ type: 'double' }) freight: number;
  @Column({ type: 'json' }) address: any;
  @Column() createTime: string;
  @Column({ type: 'json' }) logistics: any;
  @Column({ type: 'text', nullable: true }) install: string;
}

@Entity('wx_user')
export class WxUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) openid: string;
  @Column({ nullable: true }) unionid: string;
  @Column() nickname: string;
  @Column() avatar: string;
  @Column() level: string;
  @Column({ type: 'double' }) balance: number;
  @Column() points: number;
  @Column() coupons: number;
  @Column({ nullable: true }) phone: string;
}

@Entity('wx_address')
export class WxAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;
  @Column() phone: string;
  @Column() region: string;
  @Column({ type: 'text' }) detail: string;
  @Column() tag: string;
  @Column() isDefault: boolean;
}
