// pages/order/detail.js 订单详情
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: { order: {} },

  onLoad(options) {
    if (!auth.requireLogin()) return;
    api.getOrder(options.id)
      .then(order => this.setData({ order }))
      .catch(() => {});
  },

  copyId() {
    wx.setClipboardData({ data: this.data.order.id });
  }
});
