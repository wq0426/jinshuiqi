// pages/order/confirm.js 确认订单
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');

Page({
  data: {
    address: {},
    items: [],
    goodsTotal: '0.00',
    freight: '0.00',
    payTotal: '0.00',
    deliverIdx: 0,
    deliverWays: ['送货上门 + 免费安装', '到店自提', '仅配送不安装'],
    remark: ''
  },

  onLoad(options) {
    if (!auth.requireLogin()) return;
    let items = [];
    if (options.items) {
      items = JSON.parse(decodeURIComponent(options.items));
    } else if (options.buy) {
      items = [JSON.parse(decodeURIComponent(options.buy))];
    }
    this.setData({ items });
    this.compute();
    // 默认收货地址
    api.getAddresses()
      .then(list => {
        const def = list.find(a => a.isDefault) || list[0] || {};
        this.setData({ address: def });
      })
      .catch(() => {});
  },

  compute() {
    let total = 0;
    this.data.items.forEach(it => { total += it.price * it.count; });
    this.setData({
      goodsTotal: util.money(total),
      freight: '0.00',
      payTotal: util.money(total)
    });
  },

  selectDeliver(e) {
    this.setData({ deliverIdx: Number(e.detail.value) });
  },

  onRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  chooseAddress() {
    wx.navigateTo({ url: '/pages/address/list?select=1' });
  },

  submit() {
    wx.showLoading({ title: '提交中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '下单成功', icon: 'success' });
      // 清空购物车中已结算项（简单处理：清空全部已勾选）
      const app = getApp();
      app.globalData.cart = app.globalData.cart.filter(it => !it.checked);
      app.saveCart();
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/order/list?tab=0' });
      }, 900);
    }, 800);
  }
});
