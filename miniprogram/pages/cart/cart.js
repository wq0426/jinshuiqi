// pages/cart/cart.js 购物车
const util = require('../../utils/util.js');

Page({
  data: {
    cart: [],
    allChecked: true,
    total: '0.00',
    checkedCount: 0
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    const cart = getApp().globalData.cart;
    this.setData({ cart });
    this.compute();
  },

  // 计算合计与全选状态
  compute() {
    const cart = this.data.cart;
    let total = 0, checkedCount = 0;
    cart.forEach(it => {
      if (it.checked) {
        total += it.price * it.count;
        checkedCount += it.count;
      }
    });
    const allChecked = cart.length > 0 && cart.every(it => it.checked);
    this.setData({
      total: util.money(total),
      checkedCount,
      allChecked
    });
    getApp().saveCart();
  },

  // 勾选单项
  toggleItem(e) {
    const i = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart[i].checked = !cart[i].checked;
    this.setData({ cart });
    this.compute();
  },

  // 全选
  toggleAll() {
    const next = !this.data.allChecked;
    const cart = this.data.cart.map(it => ({ ...it, checked: next }));
    this.setData({ cart, allChecked: next });
    this.compute();
  },

  // 数量加减
  changeCount(e) {
    const { index, type } = e.currentTarget.dataset;
    const cart = this.data.cart;
    if (type === 'plus') {
      cart[index].count++;
    } else if (cart[index].count > 1) {
      cart[index].count--;
    }
    this.setData({ cart });
    this.compute();
  },

  // 删除
  removeItem(e) {
    const i = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该商品？',
      success: (res) => {
        if (res.confirm) {
          const cart = this.data.cart;
          cart.splice(i, 1);
          getApp().globalData.cart = cart;
          this.setData({ cart });
          this.compute();
        }
      }
    });
  },

  goShop() {
    wx.switchTab({ url: '/pages/mall/mall' });
  },

  checkout() {
    const items = this.data.cart.filter(it => it.checked);
    if (items.length === 0) {
      util.tip('请选择商品');
      return;
    }
    const data = encodeURIComponent(JSON.stringify(items));
    wx.navigateTo({ url: '/pages/order/confirm?items=' + data });
  }
});
