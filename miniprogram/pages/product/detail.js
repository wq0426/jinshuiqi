// pages/product/detail.js 商品详情
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    product: {},
    specs: [],
    curSpec: 0,
    features: [
      { emoji: '🛡️', name: '5重过滤', desc: '层层净化' },
      { emoji: '💧', name: '即滤即饮', desc: '鲜活好水' },
      { emoji: '🔧', name: '免费安装', desc: '上门服务' },
      { emoji: '🔄', name: '7天无忧', desc: '退换保障' }
    ]
  },

  onLoad(options) {
    const id = Number(options.id) || 1;
    api.getProduct(id)
      .then(product => {
        this.setData({ product, specs: product.specs || [] });
      })
      .catch(() => {});
  },

  selectSpec(e) {
    this.setData({ curSpec: e.currentTarget.dataset.idx });
  },

  addCart() {
    const spec = this.data.specs[this.data.curSpec];
    getApp().addToCart(this.data.product, 1, spec);
    util.tip('已加入购物车');
  },

  buyNow() {
    const p = this.data.product;
    const spec = this.data.specs[this.data.curSpec];
    const item = encodeURIComponent(JSON.stringify({
      id: p.id, title: p.title, price: p.price, color: p.color, emoji: p.emoji, spec, count: 1
    }));
    wx.navigateTo({ url: '/pages/order/confirm?buy=' + item });
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});
