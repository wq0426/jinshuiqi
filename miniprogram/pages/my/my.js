// pages/my/my.js 我的
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    statusBarHeight: 20,
    user: {},
    grids: [],
    orderEntry: [
      { id: 0, name: '待付款', emoji: '💰' },
      { id: 1, name: '待发货', emoji: '📦' },
      { id: 2, name: '待安装', emoji: '🔧' },
      { id: 3, name: '已完成', emoji: '✅' }
    ]
  },

  onLoad() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3, cartCount: getApp().getCartCount() });
    }
    // 「我的」是个人页：未登录则跳转登录，不加载任何个人数据
    if (!auth.requireLogin()) return;
    this.loadData();
  },

  // 加载个人数据（需登录）
  loadData() {
    Promise.all([api.getUser(), api.getMyGrids()])
      .then(([u, grids]) => {
        // 「设置」固定追加到常用功能末尾（原本在头部右上角的 ⚙️）
        const gridsWithSetting = [
          ...grids,
          { id: 'setting', name: '设置', emoji: '⚙️', url: '/pages/setting/setting' }
        ];
        this.setData({
          grids: gridsWithSetting,
          user: {
            nickName: u.nickname,
            avatar: u.avatar,
            level: u.level,
            balance: u.balance,
            points: u.points,
            coupons: u.coupons,
            phone: u.phone || '138****8888'
          }
        });
      })
      .catch(() => {});
  },

  onGrid(e) {
    const { url, tab } = e.currentTarget.dataset;
    util.navTo(url, tab);
  },

  goOrder(e) {
    wx.navigateTo({ url: '/pages/order/list?tab=' + e.currentTarget.dataset.id });
  }
});
