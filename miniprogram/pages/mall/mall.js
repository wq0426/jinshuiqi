// pages/mall/mall.js 商城
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    categories: [],
    curCat: 'all',
    list: [],
    cartCount: 0
  },

  // 全量商品（本地缓存，用于切分类筛选）
  allProducts: [],

  onLoad() {
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([categories, products]) => {
        this.allProducts = products;
        this.setData({ categories });
        this.filter('all');
      })
      .catch(() => {});
  },

  onShow() {
    this.refreshCart();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1, cartCount: getApp().getCartCount() });
    }
  },

  refreshCart() {
    this.setData({ cartCount: getApp().getCartCount() });
  },

  switchCat(e) {
    this.filter(e.currentTarget.dataset.id);
  },

  filter(cat) {
    const list = cat === 'all'
      ? this.allProducts
      : this.allProducts.filter(p => p.cat === cat);
    this.setData({ curCat: cat, list });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id });
  },

  addCart(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.allProducts.find(p => p.id === id);
    getApp().addToCart(product, 1, product.title);
    this.refreshCart();
    util.tip('已加入购物车');
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});
