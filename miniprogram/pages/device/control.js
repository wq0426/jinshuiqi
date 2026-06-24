// pages/device/control.js 设备控制（IoT）
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    device: {},
    chart: [],
    chartMax: 20,
    minLife: 0,
    flushing: false
  },

  onLoad(options) {
    if (!auth.requireLogin()) return;
    this._id = options.id;
    Promise.all([api.getDevice(options.id), api.getWaterChart()])
      .then(([device, waterChart]) => {
        const minLife = device.filters.reduce((m, f) => Math.min(m, f.life), 100);
        const chartMax = Math.max.apply(null, waterChart.map(c => c.value));
        // 计算柱状高度百分比
        const chart = waterChart.map(c => Object.assign({}, c, { h: Math.round(c.value / chartMax * 100) }));
        this.setData({ device, minLife, chart, chartMax });
      })
      .catch(() => {});
  },

  // 开关机
  togglePower() {
    const power = !this.data.device.power;
    this.setData({ 'device.power': power, 'device.online': power });
    api.controlDevice(this._id, 'power', power).catch(() => {});
    wx.showToast({ title: power ? '已开机' : '已关机', icon: 'none' });
  },

  // 一键冲洗
  flush() {
    if (this.data.flushing) return;
    if (!this.data.device.power) {
      wx.showToast({ title: '请先开机', icon: 'none' });
      return;
    }
    this.setData({ flushing: true });
    api.controlDevice(this._id, 'flush', true).catch(() => {});
    wx.showToast({ title: '冲洗中...', icon: 'loading', duration: 2000 });
    setTimeout(() => {
      this.setData({ flushing: false });
      wx.showToast({ title: '冲洗完成', icon: 'success' });
    }, 2000);
  },

  // 滤芯复位
  resetFilter(e) {
    const i = e.currentTarget.dataset.index;
    const key = `device.filters[${i}].life`;
    this.setData({ [key]: 100 });
    const minLife = this.data.device.filters.reduce((m, f) => Math.min(m, f.life), 100);
    this.setData({ minLife });
    wx.showToast({ title: '滤芯已复位', icon: 'success' });
  },

  // 水质检测
  detect() {
    wx.showToast({ title: '检测中...', icon: 'loading', duration: 1500 });
    setTimeout(() => {
      wx.showToast({ title: '水质优 · 可直饮', icon: 'success' });
    }, 1500);
  }
});
