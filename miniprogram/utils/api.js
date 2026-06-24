// utils/api.js 接口封装（对接后端 /api/wx/*）
// 正式环境通过 HTTPS 域名请求；需在「微信公众平台 → 开发管理 → 开发设置 →
// 服务器域名」的 request 合法域名中加入 https://abc.hi.cn
const BASE = 'https://abc.hi.cn/api';
// 本地联调时可临时改回下一行（并在开发者工具勾选「不校验合法域名」）：
// const BASE = 'http://localhost:3100/api';

// 避免多个并发 401 同时弹出多个登录页
let redirecting = false;
function gotoLogin() {
  if (redirecting) return;
  redirecting = true;
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.navigateTo({
    url: '/pages/login/login',
    complete: () => { setTimeout(() => { redirecting = false; }, 1000); }
  });
}

// 通用请求，自动带 token、拆 { code, message, data } 信封，401 自动跳登录
function request(method, url, data) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || '';
    const header = { 'content-type': 'application/json' };
    if (token) header['Authorization'] = 'Bearer ' + token;
    wx.request({
      url: BASE + url,
      method,
      data: data || {},
      header,
      success(res) {
        // 未登录 / token 失效：清除登录态并跳转登录页
        if (res.statusCode === 401) {
          wx.showToast({ title: '请先登录', icon: 'none' });
          gotoLogin();
          reject(res.data);
          return;
        }
        const body = res.data;
        if (body && body.code === 0) {
          resolve(body.data);
        } else {
          wx.showToast({ title: (body && body.message) || '请求失败', icon: 'none' });
          reject(body);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络错误，请检查后端服务', icon: 'none' });
        reject(err);
      }
    });
  });
}

const get = (url) => request('GET', url);
const post = (url, data) => request('POST', url, data);
const put = (url, data) => request('PUT', url, data);
const del = (url) => request('DELETE', url);

module.exports = {
  BASE,
  // 首页聚合
  getBanners: () => get('/wx/banners'),
  getGrids: () => get('/wx/grids'),
  getCategories: () => get('/wx/categories'),
  getServiceTypes: () => get('/wx/service-types'),
  getOrderTabs: () => get('/wx/order-tabs'),
  getMyGrids: () => get('/wx/my-grids'),
  getWaterChart: () => get('/wx/water-chart'),
  // 商品
  getProducts: () => get('/wx/products'),
  getProduct: (id) => get('/wx/products/' + id),
  // 设备
  getDevices: () => get('/wx/devices'),
  getDevice: (id) => get('/wx/devices/' + id),
  controlDevice: (id, action, value) => post('/wx/devices/' + id + '/control', { action, value }),
  // 工单
  getWorkorders: () => get('/wx/workorders'),
  getWorkorder: (id) => get('/wx/workorders/' + id),
  createWorkorder: (data) => post('/wx/workorders', data),
  // 订单
  getOrders: () => get('/wx/orders'),
  getOrder: (id) => get('/wx/orders/' + id),
  // 分销
  getDistribution: () => get('/wx/distribution'),
  // 充值
  getRechargePackages: () => get('/wx/recharge-packages'),
  recharge: (data) => post('/wx/recharge', data),
  // 地址
  getAddresses: () => get('/wx/addresses'),
  createAddress: (data) => post('/wx/addresses', data),
  updateAddress: (id, data) => put('/wx/addresses/' + id, data),
  deleteAddress: (id) => del('/wx/addresses/' + id),
  // 用户
  getUser: () => get('/wx/user'),
  login: (data) => post('/wx/login', data)
};
