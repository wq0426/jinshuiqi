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
