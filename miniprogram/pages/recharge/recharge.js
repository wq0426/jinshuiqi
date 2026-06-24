// pages/recharge/recharge.js 充值
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    balance: 0,
    packages: [],
    curPkg: 3,
    payways: [
      { id: 'wx', name: '微信支付', emoji: '💚' },
      { id: 'balance', name: '储值卡', emoji: '💳' }
    ],
    curPay: 'wx'
  },

  onLoad() {
    if (!auth.requireLogin()) return;
    Promise.all([api.getRechargePackages(), api.getUser()])
      .then(([packages, user]) => {
        this.setData({ packages, balance: user.balance });
      })
      .catch(() => {});
  },

  selectPkg(e) {
    this.setData({ curPkg: e.currentTarget.dataset.idx });
  },

  selectPay(e) {
    this.setData({ curPay: e.currentTarget.dataset.id });
  },

  recharge() {
    const pkg = this.data.packages[this.data.curPkg];
    if (!pkg) return;
    wx.showLoading({ title: '支付中...' });
    api.recharge({ packageId: pkg.id, amount: pkg.amount })
      .then(() => {
        wx.hideLoading();
        const add = pkg.amount + pkg.gift;
        this.setData({ balance: Number((this.data.balance + add).toFixed(2)) });
        wx.showToast({ title: '充值成功 +' + add, icon: 'success' });
      })
      .catch(() => {
        wx.hideLoading();
      });
  }
});
