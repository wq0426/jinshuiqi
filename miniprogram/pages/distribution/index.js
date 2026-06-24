// pages/distribution/index.js 分销中心（链动2+1）
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    dist: { team: [], levels: [], incomeList: [] },
    teamTab: 'direct',
    teamList: []
  },

  onLoad() {
    if (!auth.requireLogin()) return;
    api.getDistribution()
      .then(dist => {
        this.setData({ dist });
        this.filterTeam('direct');
      })
      .catch(() => {});
  },

  switchTeam(e) {
    this.filterTeam(e.currentTarget.dataset.type);
  },

  filterTeam(type) {
    const map = { direct: '直推', indirect: '间推' };
    const teamList = this.data.dist.team.filter(t => t.type === map[type]);
    this.setData({ teamTab: type, teamList });
  },

  withdraw() {
    wx.showModal({
      title: '申请提现',
      content: '可提现金额 ¥' + this.data.dist.withdrawable + '，确认提现到微信钱包？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '提现申请已提交', icon: 'success' });
        }
      }
    });
  },

  invite() {
    wx.showToast({ title: '邀请海报已生成', icon: 'success' });
  }
});
