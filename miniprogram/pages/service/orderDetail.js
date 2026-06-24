// pages/service/orderDetail.js 工单详情
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: { order: {} },

  onLoad(options) {
    if (!auth.requireLogin()) return;
    api.getWorkorder(options.id)
      .then(order => this.setData({ order }))
      .catch(() => {});
  },

  callMaster() {
    const m = this.data.order.master;
    if (!m) return;
    wx.showToast({ title: '拨打 ' + m.phone, icon: 'none' });
  }
});
