// app.js 全局逻辑
App({
  globalData: {
    // 购物车数据（全局共享，含数量与勾选状态，属于本地会话态）
    cart: []
  },

  onLaunch() {
    // 从本地缓存恢复购物车
    const cart = wx.getStorageSync('cart');
    if (cart && Array.isArray(cart)) {
      this.globalData.cart = cart;
    }
  },

  // 计算购物车总数量（用于角标）
  getCartCount() {
    return this.globalData.cart.reduce((sum, item) => sum + item.count, 0);
  },

  // 加入购物车
  addToCart(product, count = 1, spec = '') {
    const cart = this.globalData.cart;
    const key = product.id + '_' + spec;
    const exist = cart.find(it => it.key === key);
    if (exist) {
      exist.count += count;
    } else {
      cart.push({
        key,
        id: product.id,
        title: product.title,
        price: product.price,
        color: product.color,
        emoji: product.emoji,
        spec,
        count,
        checked: true
      });
    }
    this.saveCart();
  },

  saveCart() {
    wx.setStorageSync('cart', this.globalData.cart);
    // 通知自定义 tabBar 更新角标
    this.updateTabBarBadge();
  },

  // 更新 tabBar 购物车角标（商城页）
  updateTabBarBadge() {
    const count = this.getCartCount();
    const pages = getCurrentPages();
    const cur = pages[pages.length - 1];
    if (cur && typeof cur.getTabBar === 'function' && cur.getTabBar()) {
      cur.getTabBar().setData({ cartCount: count });
    }
  }
});
