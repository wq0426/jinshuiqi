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
    if (!auth.requireLogin()) return;
    const tab = options.tab !== undefined ? Number(options.tab) : -1;
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
