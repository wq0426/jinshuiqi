// custom-tab-bar/index.js 自定义底部导航
Component({
  data: {
    selected: 0,
    cartCount: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '🏠' },
      { pagePath: '/pages/mall/mall', text: '商城', icon: '🛒' },
      { pagePath: '/pages/service/service', text: '服务', icon: '🧰', center: true },
      { pagePath: '/pages/my/my', text: '我的', icon: '👤' }
    ]
  },
  attached() {
    const app = getApp();
    if (app && app.getCartCount) {
      this.setData({ cartCount: app.getCartCount() });
    }
  },
  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset;
      this.setData({ selected: index });
      wx.switchTab({ url: path });
    }
  }
});
