// pages/setting/setting.js 设置
const util = require('../../utils/util.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    version: '1.0.0',
    items: [
      { id: 'account',  name: '账号与安全', emoji: '🔒', extra: '' },
      { id: 'notify',   name: '消息通知',   emoji: '🔔', extra: '' },
      { id: 'cache',    name: '清除缓存',   emoji: '🧹', extra: '' },
      { id: 'about',    name: '关于我们',   emoji: 'ℹ️', extra: '' }
    ]
  },

  onTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id === 'cache') return this.clearCache();
    if (id === 'about') return this.showAbout();
    // 暂未实现的入口，统一提示
    util.tip('功能开发中');
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？',
      success: (res) => {
        if (!res.confirm) return;
        try { wx.clearStorageSync(); } catch (e) {}
        util.ok('已清除');
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '德康泉\n版本 v' + this.data.version + '\n客服热线 400-888-6666',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (!res.confirm) return;
        auth.clearLogin();
        util.ok('已退出');
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/login/login' });
        }, 600);
      }
    });
  }
});
