// pages/service/service.js 服务
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

// 工单状态步骤（纯 UI 常量）
const WORK_ORDER_STEPS = ['待派单', '已派单', '上门中', '服务中', '已完成'];

Page({
  data: {
    serviceTypes: [],
    steps: WORK_ORDER_STEPS,
    workOrders: []
  },

  onLoad() {
    // 服务类型公开；「我的工单」属于个人数据，仅登录后加载
    api.getServiceTypes()
      .then((serviceTypes) => this.setData({ serviceTypes }))
      .catch(() => {});
    if (auth.isLogin()) {
      api.getWorkorders()
        .then((workOrders) => this.setData({ workOrders }))
        .catch(() => {});
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2, cartCount: getApp().getCartCount() });
    }
  },

  goBooking(e) {
    const type = e.currentTarget.dataset.type || '';
    wx.navigateTo({ url: '/pages/service/booking?type=' + type });
  },

  goOrderDetail(e) {
    wx.navigateTo({ url: '/pages/service/orderDetail?id=' + e.currentTarget.dataset.id });
  }
});
