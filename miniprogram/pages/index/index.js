// pages/index/index.js 首页
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    statusBarHeight: 20,
    banners: [],
    grids: [],
    device: {},
    recommend: [],
    flow: [
      { step: '01', name: '在线下单', emoji: '📝' },
      { step: '02', name: '预约时间', emoji: '📅' },
      { step: '03', name: '师傅上门', emoji: '🚚' },
      { step: '04', name: '安装调试', emoji: '🔧' },
      { step: '05', name: '验收使用', emoji: '✅' }
    ]
  },

  onLoad() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
    // 公开内容始终加载；「我的设备」属于个人数据，仅登录后加载（未登录不触发 401 跳登录）
    Promise.all([api.getBanners(), api.getGrids(), api.getProducts()])
      .then(([banners, grids, products]) => {
        this.setData({ banners, grids, recommend: products.slice(0, 6) });
      })
      .catch(() => {});
    if (auth.isLogin()) {
      api.getDevices()
        .then((devices) => this.setData({ device: devices[0] || {} }))
        .catch(() => {});
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0, cartCount: getApp().getCartCount() });
    }
  },

  onGrid(e) {
    const { url, tab } = e.currentTarget.dataset;
    util.navTo(url, tab);
  },

  goSearch() {
    util.tip('搜索功能开发中');
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id });
  },

  goDevice() {
    wx.navigateTo({ url: '/pages/device/control?id=' + this.data.device.id });
  }
});
