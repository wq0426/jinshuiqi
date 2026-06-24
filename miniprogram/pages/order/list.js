// pages/order/list.js 我的订单
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');

Page({
  data: {
    tabs: [],
    curTab: -1,
    list: []
  },

  allOrders: [],

  onLoad(options) {
    // 兼容旧的带参数进入方式（如有）
    if (options.tab !== undefined) {
      getApp().globalData.orderTab = Number(options.tab);
    }
  },

  onShow() {
    // 订单中心作为 tabBar 页：高亮底部「订单」并加载数据
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3, cartCount: getApp().getCartCount() });
    }
    if (!auth.requireLogin()) return;
    const app = getApp();
    const tab = app.globalData.orderTab !== undefined ? app.globalData.orderTab : -1;
    app.globalData.orderTab = -1; // 用后即焚，避免下次进入残留
    this.setData({ curTab: tab });
    Promise.all([api.getOrderTabs(), api.getOrders()])
      .then(([tabs, orders]) => {
        this.allOrders = orders;
        this.setData({ tabs });
        this.filter(tab);
      })
      .catch(() => {});
  },

  switchTab(e) {
    const id = Number(e.currentTarget.dataset.id);
    this.setData({ curTab: id });
    this.filter(id);
  },

  filter(tab) {
    const list = tab === -1 ? this.allOrders : this.allOrders.filter(o => o.status === tab);
    this.setData({ list });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/order/detail?id=' + e.currentTarget.dataset.id });
  },

  pay(e) {
    util.ok('支付成功');
  }
});
