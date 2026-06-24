// pages/address/list.js 地址管理
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    list: [],
    selectMode: false,
    showForm: false,
    editId: null,
    form: { name: '', phone: '', region: '', detail: '', tag: '家', isDefault: false },
    tags: ['家', '公司', '父母', '其他']
  },

  onLoad(options) {
    if (!auth.requireLogin()) return;
    this.setData({ selectMode: options.select === '1' });
    this.loadList();
  },

  loadList() {
    api.getAddresses()
      .then(list => this.setData({ list }))
      .catch(() => {});
  },

  selectAddr(e) {
    if (!this.data.selectMode) return;
    wx.showToast({ title: '已选择该地址', icon: 'none' });
    setTimeout(() => wx.navigateBack(), 600);
  },

  openAdd() {
    this.setData({
      showForm: true, editId: null,
      form: { name: '', phone: '', region: '', detail: '', tag: '家', isDefault: false }
    });
  },

  openEdit(e) {
    const item = this.data.list.find(a => a.id === e.currentTarget.dataset.id);
    this.setData({ showForm: true, editId: item.id, form: { ...item } });
  },

  closeForm() {
    this.setData({ showForm: false });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ ['form.' + field]: e.detail.value });
  },

  selectTag(e) {
    this.setData({ 'form.tag': e.currentTarget.dataset.tag });
  },

  toggleDefault() {
    this.setData({ 'form.isDefault': !this.data.form.isDefault });
  },

  saveAddr() {
    const f = this.data.form;
    if (!f.name || !f.phone || !f.detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    const payload = { name: f.name, phone: f.phone, region: f.region, detail: f.detail, tag: f.tag, isDefault: f.isDefault };
    const req = this.data.editId
      ? api.updateAddress(this.data.editId, payload)
      : api.createAddress(payload);
    req
      .then(() => {
        this.setData({ showForm: false });
        wx.showToast({ title: '保存成功', icon: 'success' });
        this.loadList();
      })
      .catch(() => {});
  },

  delAddr(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示', content: '确定删除该地址？',
      success: (res) => {
        if (res.confirm) {
          api.deleteAddress(id)
            .then(() => this.loadList())
            .catch(() => {});
        }
      }
    });
  }
});
