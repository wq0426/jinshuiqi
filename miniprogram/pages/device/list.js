// pages/device/list.js 我的设备
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: { devices: [] },

  onLoad() {
    if (!auth.requireLogin()) return;
    api.getDevices()
      .then(list => {
        // 计算每台设备最小滤芯寿命用于环形展示
        const devices = list.map(d => {
          const minLife = d.filters.reduce((m, f) => Math.min(m, f.life), 100);
          return Object.assign({}, d, { minLife });
        });
        this.setData({ devices });
      })
      .catch(() => {});
  },

  goControl(e) {
    wx.navigateTo({ url: '/pages/device/control?id=' + e.currentTarget.dataset.id });
  }
});
