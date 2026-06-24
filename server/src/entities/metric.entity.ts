import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 通用聚合数据表：按 key 存整块 JSON。
 * 用于 dashboard / dataCenter / distOverview / rechargeTrend
 * 以及 wx 的 banners/grids/serviceTypes/orderTabs/myGrids/distribution 等。
 */
@Entity('metric')
export class Metric {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  key: string;

  @Column({ type: 'json' })
  data: any;
}
