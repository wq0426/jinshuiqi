// utils/auth.js 登录态管理

function getToken() {
  return wx.getStorageSync('token') || '';
}

function isLogin() {
  return !!getToken();
}

// 保存登录态
function setLogin(token, userInfo) {
  wx.setStorageSync('token', token);
  if (userInfo) wx.setStorageSync('userInfo', userInfo);
}

// 清除登录态
function clearLogin() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
}

// 页面守卫：未登录则跳转登录页并返回 false
function requireLogin() {
  if (isLogin()) return true;
  wx.navigateTo({ url: '/pages/login/login' });
  return false;
}

module.exports = { getToken, isLogin, setLogin, clearLogin, requireLogin };
