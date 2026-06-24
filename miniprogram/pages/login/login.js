// pages/login/login.js 登录
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    logging: false
  },

  onLogin() {
    if (this.data.logging) return;
    this.setData({ logging: true });
    // 微信一键登录：先取临时 code，交后端换 openid 并签发 token
    // （后端未配 WX_APPID/WX_SECRET 时会自动回退测试账号，不影响联调）
    wx.login({
      success: (r) => {
        api.login({ code: r.code })
          .then((res) => {
            auth.setLogin(res.token, res.userInfo);
            wx.showToast({ title: '登录成功', icon: 'success' });
            setTimeout(() => this.back(), 500);
          })
          .catch(() => {
            this.setData({ logging: false });
          });
      },
      fail: () => {
        wx.showToast({ title: '微信登录失败', icon: 'none' });
        this.setData({ logging: false });
      }
    });
  },

  // 登录成功后：能返回上一页则返回，否则回到「我的」tab
  back() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/my/my' });
    }
  }
});
