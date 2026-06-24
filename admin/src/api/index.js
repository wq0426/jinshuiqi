// 管理后台接口（对接 /api/admin/*）
import request from './request'

// ---------- 鉴权 ----------
export const login = (data) => request.post('/admin/auth/login', data)

// ---------- 工作台 ----------
export const getStatCards = () => request.get('/admin/dashboard/stat-cards')
export const getRevenueTrend = () => request.get('/admin/dashboard/revenue-trend')
export const getWorkorderStatus = () => request.get('/admin/dashboard/workorder-status')
export const getTodos = () => request.get('/admin/dashboard/todos')
export const getLatestWorkorders = () => request.get('/admin/dashboard/latest-workorders')

// ---------- 数据中心 ----------
export const getInstallData = () => request.get('/admin/data/install')
export const getRechargeAnalysis = () => request.get('/admin/data/recharge')
export const getCustomerAnalysis = () => request.get('/admin/data/customer')
export const getScreenData = () => request.get('/admin/data/screen')

// ---------- 商城：分类 ----------
export const getCategories = () => request.get('/admin/categories')
export const createCategory = (data) => request.post('/admin/categories', data)
export const updateCategory = (id, data) => request.put(`/admin/categories/${id}`, data)
export const deleteCategory = (id) => request.delete(`/admin/categories/${id}`)

// ---------- 商城：商品 ----------
export const getProducts = () => request.get('/admin/products')
export const createProduct = (data) => request.post('/admin/products', data)
export const updateProduct = (id, data) => request.put(`/admin/products/${id}`, data)
export const deleteProduct = (id) => request.delete(`/admin/products/${id}`)
export const setProductSale = (id, onSale) => request.patch(`/admin/products/${id}/sale`, { onSale })

// ---------- 商城：订单 ----------
export const getOrders = () => request.get('/admin/orders')
export const getOrder = (id) => request.get(`/admin/orders/${id}`)

// ---------- 设备 ----------
export const getDevices = () => request.get('/admin/devices')
export const getDevice = (id) => request.get(`/admin/devices/${id}`)
export const controlDevice = (id, action, value) => request.post(`/admin/devices/${id}/control`, { action, value })
export const getDeviceModels = () => request.get('/admin/device-models')
export const createDeviceModel = (data) => request.post('/admin/device-models', data)
export const updateDeviceModel = (id, data) => request.put(`/admin/device-models/${id}`, data)
export const deleteDeviceModel = (id) => request.delete(`/admin/device-models/${id}`)

// ---------- 工单 ----------
export const getWorkorders = () => request.get('/admin/workorders')
export const getWorkorder = (id) => request.get(`/admin/workorders/${id}`)
export const dispatchWorkorder = (id, technician) => request.post(`/admin/workorders/${id}/dispatch`, { technician })

// ---------- 师傅 ----------
export const getTechnicians = () => request.get('/admin/technicians')
export const createTechnician = (data) => request.post('/admin/technicians', data)
export const updateTechnician = (id, data) => request.put(`/admin/technicians/${id}`, data)
export const deleteTechnician = (id) => request.delete(`/admin/technicians/${id}`)
export const setTechnicianOnline = (id, online) => request.patch(`/admin/technicians/${id}/online`, { online })

// ---------- 分销 ----------
export const getDistOverview = () => request.get('/admin/distribution/overview')
export const getDistributors = () => request.get('/admin/distributors')
export const getCommissions = () => request.get('/admin/commissions')
export const getWithdrawals = () => request.get('/admin/withdrawals')
export const auditWithdrawal = (id, status, remark) => request.post(`/admin/withdrawals/${id}/audit`, { status, remark })
export const getDistRules = () => request.get('/admin/dist-rules')
export const saveDistRules = (data) => request.put('/admin/dist-rules', data)

// ---------- 客户 ----------
export const getCustomers = () => request.get('/admin/customers')
export const getCustomer = (id) => request.get(`/admin/customers/${id}`)

// ---------- 充值 ----------
export const getRechargePackages = () => request.get('/admin/recharge/packages')
export const createRechargePackage = (data) => request.post('/admin/recharge/packages', data)
export const updateRechargePackage = (id, data) => request.put(`/admin/recharge/packages/${id}`, data)
export const deleteRechargePackage = (id) => request.delete(`/admin/recharge/packages/${id}`)
export const getRechargeRecords = () => request.get('/admin/recharge/records')
export const getRechargeTrend = () => request.get('/admin/recharge/trend')

// ---------- 预警 ----------
export const getAlerts = () => request.get('/admin/alerts')
export const handleAlert = (id) => request.post(`/admin/alerts/${id}/handle`)
export const getAlertRules = () => request.get('/admin/alert-rules')
export const saveAlertRules = (data) => request.put('/admin/alert-rules', data)

// ---------- 页面装修 / 系统设置 ----------
export const getPageConfig = () => request.get('/admin/page-config')
export const savePageConfig = (data) => request.put('/admin/page-config', data)
export const getSettings = () => request.get('/admin/settings')
export const saveSettings = (data) => request.put('/admin/settings', data)

// ---------- 排行榜激励 ----------
export const getRankings = (params) => request.get('/admin/rankings', { params })

// ---------- 营销-积分 ----------
export const getPointRules = () => request.get('/admin/point-rules')
export const createPointRule = (data) => request.post('/admin/point-rules', data)
export const updatePointRule = (id, data) => request.put(`/admin/point-rules/${id}`, data)
export const deletePointRule = (id) => request.delete(`/admin/point-rules/${id}`)
export const getPointRecords = () => request.get('/admin/point-records')

// ---------- 库存管理 ----------
export const getInventory = () => request.get('/admin/inventory')
export const createInventory = (data) => request.post('/admin/inventory', data)
export const updateInventory = (id, data) => request.put(`/admin/inventory/${id}`, data)
export const deleteInventory = (id) => request.delete(`/admin/inventory/${id}`)
export const getStockLogs = () => request.get('/admin/stock-logs')
export const stockInOut = (data) => request.post('/admin/stock-inout', data)

// ---------- 系统：角色 / 账号 / 操作日志 / 站内消息 ----------
export const getRoles = () => request.get('/admin/roles')
export const createRole = (data) => request.post('/admin/roles', data)
export const updateRole = (id, data) => request.put(`/admin/roles/${id}`, data)
export const deleteRole = (id) => request.delete(`/admin/roles/${id}`)
export const getAccounts = () => request.get('/admin/accounts')
export const createAccount = (data) => request.post('/admin/accounts', data)
export const updateAccount = (id, data) => request.put(`/admin/accounts/${id}`, data)
export const deleteAccount = (id) => request.delete(`/admin/accounts/${id}`)
export const getOpLogs = () => request.get('/admin/op-logs')
export const getNotices = () => request.get('/admin/notices')
export const readNotice = (id) => request.post(`/admin/notices/${id}/read`)

// ---------- 消息通知模板 ----------
export const getMsgTemplates = () => request.get('/admin/msg-templates')
export const createMsgTemplate = (data) => request.post('/admin/msg-templates', data)
export const updateMsgTemplate = (id, data) => request.put(`/admin/msg-templates/${id}`, data)
export const deleteMsgTemplate = (id) => request.delete(`/admin/msg-templates/${id}`)

// ---------- 师傅审核 ----------
export const getTechApplies = () => request.get('/admin/tech-applies')
export const auditTechApply = (id, status, remark) => request.post(`/admin/tech-applies/${id}/audit`, { status, remark })

// ---------- 设备：故障 / 校准 / 制水记录 ----------
export const getDeviceFaults = () => request.get('/admin/device-faults')
export const handleDeviceFault = (id, status) => request.post(`/admin/device-faults/${id}/handle`, { status })
export const getDeviceCalibrations = () => request.get('/admin/device-calibrations')
export const getWaterRecords = () => request.get('/admin/water-records')

// ---------- 在线客服 ----------
export const getChatSessions = () => request.get('/admin/chat-sessions')
export const getChatSession = (id) => request.get(`/admin/chat-sessions/${id}`)
export const replyChat = (id, text) => request.post(`/admin/chat-sessions/${id}/reply`, { text })
export const closeChat = (id) => request.post(`/admin/chat-sessions/${id}/close`)

// ---------- 支付管理 ----------
export const getPaymentRecords = () => request.get('/admin/payment-records')
export const refundPayment = (id) => request.post(`/admin/payment-records/${id}/refund`)

// ---------- 商品套餐 ----------
export const getPackages = () => request.get('/admin/packages')
export const createPackage = (data) => request.post('/admin/packages', data)
export const updatePackage = (id, data) => request.put(`/admin/packages/${id}`, data)
export const deletePackage = (id) => request.delete(`/admin/packages/${id}`)

// ---------- 分销体系 / 区域分红 ----------
export const getDistSystem = () => request.get('/admin/dist-system')
export const saveDistSystem = (data) => request.put('/admin/dist-system', data)
export const getRegionDividends = () => request.get('/admin/region-dividends')
export const updateRegionDividend = (id, data) => request.put(`/admin/region-dividends/${id}`, data)

// ---------- 续费统计 ----------
export const getRenewalData = () => request.get('/admin/data/renewal')

// ---------- 通用导出（前端 CSV） ----------
export function exportCsv(filename, columns, rows) {
  const header = columns.map((c) => c.label).join(',')
  const body = rows
    .map((r) => columns.map((c) => `"${String(r[c.prop] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const csv = '﻿' + header + '\n' + body
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
