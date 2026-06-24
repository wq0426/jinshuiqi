// utils/util.js 通用工具

// 跳转（自动判断是否 tab 页）
function navTo(url, isTab) {
  if (!url) {
    wx.showToast({ title: '功能开发中', icon: 'none' });
    return;
  }
  if (isTab) {
    wx.switchTab({ url });
  } else {
    wx.navigateTo({ url });
  }
}

// toast 成功
function ok(title = '操作成功') {
  wx.showToast({ title, icon: 'success' });
}

// toast 提示
function tip(title) {
  wx.showToast({ title, icon: 'none' });
}

// 金额格式化
function money(n) {
  return Number(n || 0).toFixed(2);
}

module.exports = { navTo, ok, tip, money };
