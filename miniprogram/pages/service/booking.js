// pages/service/booking.js 服务预约
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    types: [],
    curType: 0,
    devices: [],
    deviceNames: [],
    curDevice: 0,
    address: {},
    date: '',
    timeSlots: ['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00'],
    curSlot: 0,
    desc: '',
    minDate: ''
  },

  onLoad(options) {
    if (!auth.requireLogin()) return;
    const today = new Date();
    const minDate = this.formatDate(today);
    const tomorrow = new Date(today.getTime() + 86400000);
    this.setData({ minDate, date: this.formatDate(tomorrow) });
    this._typeParam = options.type;
    Promise.all([api.getServiceTypes(), api.getDevices(), api.getAddresses()])
      .then(([types, devices, addresses]) => {
        const deviceNames = devices.map(d => d.name + '（' + d.room + '）');
        let curType = 0;
        if (this._typeParam) {
          const idx = types.findIndex(t => t.id === this._typeParam);
          if (idx >= 0) curType = idx;
        }
        const address = addresses.find(a => a.isDefault) || addresses[0] || {};
        this.setData({ types, devices, deviceNames, address, curType });
      })
      .catch(() => {});
  },

  formatDate(d) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  },

  selectType(e) {
    this.setData({ curType: e.currentTarget.dataset.idx });
  },

  selectDevice(e) {
    this.setData({ curDevice: Number(e.detail.value) });
  },

  onDate(e) {
    this.setData({ date: e.detail.value });
  },

  selectSlot(e) {
    this.setData({ curSlot: e.currentTarget.dataset.idx });
  },

  onDesc(e) {
    this.setData({ desc: e.detail.value });
  },

  chooseAddress() {
    wx.navigateTo({ url: '/pages/address/list?select=1' });
  },

  submit() {
    const d = this.data;
    const type = d.types[d.curType] || {};
    const device = d.devices[d.curDevice] || {};
    wx.showLoading({ title: '提交中...' });
    api.createWorkorder({
      type: type.name,
      typeEmoji: type.emoji,
      device: device.name || '',
      address: (d.address.region || '') + ' ' + (d.address.detail || ''),
      time: d.date + ' ' + d.timeSlots[d.curSlot],
      desc: d.desc
    })
      .then(() => {
        wx.hideLoading();
        wx.showToast({ title: '预约成功', icon: 'success' });
        setTimeout(() => {
          wx.switchTab({ url: '/pages/service/service' });
        }, 1000);
      })
      .catch(() => {
        wx.hideLoading();
      });
  }
});
