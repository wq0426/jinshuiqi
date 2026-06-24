// 纯前端展示常量：标签/状态颜色映射、枚举（非业务数据，不走接口）

// 工单
export const workorderTypeColor = { 装机: 'success', 拆机: 'info', 迁机: 'warning', 返库: '', 维修: 'danger' }
export const workorderStatusColor = { 已下单: 'info', 已派单: 'warning', 上门中: 'primary', 服务中: '', 已完成: 'success' }
export const workorderTypes = ['装机', '拆机', '迁机', '返库', '维修']
export const workorderStatuses = ['已下单', '已派单', '上门中', '服务中', '已完成']

// 订单
export const orderStatusType = { 待付款: 'warning', 待发货: 'primary', 待收货: '', 已完成: 'success', 已取消: 'info', 退款中: 'danger' }

// 预警
export const alertTypeColor = { 滤芯到期: 'warning', 设备离线: 'info', 水质异常: 'danger', 工单超时: 'primary', 库存不足: 'success' }
export const alertLevelColor = { 高: 'danger', 中: 'warning', 低: 'info' }

// 客户
export const customerLevelColor = { 普通: 'info', 会员: 'warning', 合伙人: 'success' }

// 分销
export const distributorLevelColor = { 普通: 'info', 会员: 'warning', 合伙人: 'success' }
export const commissionStatusColor = { 已结算: 'success', 待结算: 'warning', 已冻结: 'info' }
export const withdrawStatusColor = { 待审核: 'warning', 已通过: 'success', 已驳回: 'danger' }

// 充值
export const rechargeStatusColor = { 成功: 'success', 处理中: 'warning', 已退款: 'info' }
