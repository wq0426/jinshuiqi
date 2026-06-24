import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signToken } from '../../common/token.util';
import { Metric } from '../../entities/metric.entity';
import {
  AdminAccount,
  AdminAlert,
  AdminAlertRule,
  AdminCategory,
  AdminChatSession,
  AdminCommission,
  AdminCustomer,
  AdminDevice,
  AdminDeviceCalibration,
  AdminDeviceFault,
  AdminDeviceModel,
  AdminDistRule,
  AdminDistributor,
  AdminInventory,
  AdminMsgTemplate,
  AdminNotice,
  AdminOpLog,
  AdminOrder,
  AdminPackage,
  AdminPaymentRecord,
  AdminPointRecord,
  AdminPointRule,
  AdminProduct,
  AdminRanking,
  AdminRechargePackage,
  AdminRechargeRecord,
  AdminRegionDividend,
  AdminRole,
  AdminStockLog,
  AdminTechApply,
  AdminTechnician,
  AdminWaterRecord,
  AdminWithdrawal,
  AdminWorkorder,
} from '../../entities/admin.entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Metric) private metricRepo: Repository<Metric>,
    @InjectRepository(AdminCategory) private categoryRepo: Repository<AdminCategory>,
    @InjectRepository(AdminProduct) private productRepo: Repository<AdminProduct>,
    @InjectRepository(AdminOrder) private orderRepo: Repository<AdminOrder>,
    @InjectRepository(AdminDevice) private deviceRepo: Repository<AdminDevice>,
    @InjectRepository(AdminDeviceModel) private deviceModelRepo: Repository<AdminDeviceModel>,
    @InjectRepository(AdminWorkorder) private workorderRepo: Repository<AdminWorkorder>,
    @InjectRepository(AdminTechnician) private technicianRepo: Repository<AdminTechnician>,
    @InjectRepository(AdminDistributor) private distributorRepo: Repository<AdminDistributor>,
    @InjectRepository(AdminCommission) private commissionRepo: Repository<AdminCommission>,
    @InjectRepository(AdminWithdrawal) private withdrawalRepo: Repository<AdminWithdrawal>,
    @InjectRepository(AdminDistRule) private distRuleRepo: Repository<AdminDistRule>,
    @InjectRepository(AdminCustomer) private customerRepo: Repository<AdminCustomer>,
    @InjectRepository(AdminRechargePackage) private rechargePackageRepo: Repository<AdminRechargePackage>,
    @InjectRepository(AdminRechargeRecord) private rechargeRecordRepo: Repository<AdminRechargeRecord>,
    @InjectRepository(AdminAlert) private alertRepo: Repository<AdminAlert>,
    @InjectRepository(AdminAlertRule) private alertRuleRepo: Repository<AdminAlertRule>,
    @InjectRepository(AdminRanking) private rankingRepo: Repository<AdminRanking>,
    @InjectRepository(AdminPointRule) private pointRuleRepo: Repository<AdminPointRule>,
    @InjectRepository(AdminPointRecord) private pointRecordRepo: Repository<AdminPointRecord>,
    @InjectRepository(AdminInventory) private inventoryRepo: Repository<AdminInventory>,
    @InjectRepository(AdminStockLog) private stockLogRepo: Repository<AdminStockLog>,
    @InjectRepository(AdminRole) private roleRepo: Repository<AdminRole>,
    @InjectRepository(AdminAccount) private accountRepo: Repository<AdminAccount>,
    @InjectRepository(AdminOpLog) private opLogRepo: Repository<AdminOpLog>,
    @InjectRepository(AdminNotice) private noticeRepo: Repository<AdminNotice>,
    @InjectRepository(AdminMsgTemplate) private msgTemplateRepo: Repository<AdminMsgTemplate>,
    @InjectRepository(AdminTechApply) private techApplyRepo: Repository<AdminTechApply>,
    @InjectRepository(AdminDeviceFault) private deviceFaultRepo: Repository<AdminDeviceFault>,
    @InjectRepository(AdminDeviceCalibration) private deviceCalibrationRepo: Repository<AdminDeviceCalibration>,
    @InjectRepository(AdminWaterRecord) private waterRecordRepo: Repository<AdminWaterRecord>,
    @InjectRepository(AdminChatSession) private chatSessionRepo: Repository<AdminChatSession>,
    @InjectRepository(AdminPaymentRecord) private paymentRecordRepo: Repository<AdminPaymentRecord>,
    @InjectRepository(AdminPackage) private packageRepo: Repository<AdminPackage>,
    @InjectRepository(AdminRegionDividend) private regionDividendRepo: Repository<AdminRegionDividend>,
  ) {}

  // ---------- metric helpers ----------
  private async getMetric(key: string, fallback: any = null) {
    const row = await this.metricRepo.findOne({ where: { key } });
    return row ? row.data : fallback;
  }
  private async setMetric(key: string, data: any) {
    await this.metricRepo.save({ key, data });
    return data;
  }

  // ---------- auth ----------
  login(username: string, password: string) {
    // 校验管理员账号密码（默认 admin / 123456，可在 .env 配置）
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || '123456';
    if (username !== adminUser || password !== adminPass) {
      throw new UnauthorizedException('账号或密码错误');
    }
    const token = signToken({ scope: 'admin', username });
    return {
      token,
      user: {
        username,
        nickname: '超级管理员',
        role: 'admin',
        avatar: 'linear-gradient(135deg,#3A8EF6,#26C6DA)',
      },
    };
  }

  // ---------- dashboard ----------
  statCards() { return this.getMetric('dashboard.statCards', []); }
  revenueTrend() { return this.getMetric('dashboard.revenueTrend', {}); }
  workorderStatus() { return this.getMetric('dashboard.workorderStatus', []); }
  todos() { return this.getMetric('dashboard.todoList', []); }
  latestWorkorders() { return this.getMetric('dashboard.latestWorkorders', []); }

  // ---------- data center ----------
  installData() { return this.getMetric('data.install', {}); }
  rechargeAnalysis() { return this.getMetric('data.recharge', {}); }
  customerAnalysis() { return this.getMetric('data.customer', {}); }
  screenData() { return this.getMetric('data.screen', {}); }

  // ---------- categories ----------
  listCategories() { return this.categoryRepo.find({ order: { sort: 'ASC' } }); }
  async createCategory(body: Partial<AdminCategory>) {
    const entity = this.categoryRepo.create({ count: 0, sort: 0, ...body, id: undefined });
    return this.categoryRepo.save(entity);
  }
  async updateCategory(id: number, body: Partial<AdminCategory>) {
    const entity = await this.categoryRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('分类不存在');
    Object.assign(entity, body, { id });
    return this.categoryRepo.save(entity);
  }
  async deleteCategory(id: number) {
    await this.categoryRepo.delete(id);
    return null;
  }

  // ---------- products ----------
  listProducts() { return this.productRepo.find({ order: { sort: 'ASC' } }); }
  async createProduct(body: Partial<AdminProduct>) {
    const cat = body.categoryId
      ? await this.categoryRepo.findOne({ where: { id: body.categoryId } })
      : null;
    const entity = this.productRepo.create({
      image: 'linear-gradient(135deg,#3A8EF6,#26C6DA)',
      onSale: true,
      stock: 0,
      sales: 0,
      sort: 0,
      originPrice: 0,
      price: 0,
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...body,
      id: undefined,
      category: body.category || (cat ? cat.name : ''),
    });
    return this.productRepo.save(entity);
  }
  async updateProduct(id: number, body: Partial<AdminProduct>) {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('商品不存在');
    if (body.categoryId && body.categoryId !== entity.categoryId) {
      const cat = await this.categoryRepo.findOne({ where: { id: body.categoryId } });
      if (cat) body.category = cat.name;
    }
    Object.assign(entity, body, { id });
    return this.productRepo.save(entity);
  }
  async deleteProduct(id: number) {
    await this.productRepo.delete(id);
    return null;
  }
  async setProductSale(id: number, onSale: boolean) {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('商品不存在');
    entity.onSale = onSale;
    return this.productRepo.save(entity);
  }

  // ---------- orders ----------
  listOrders() { return this.orderRepo.find({ order: { createTime: 'DESC' } }); }
  async getOrder(id: string) {
    const entity = await this.orderRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('订单不存在');
    return entity;
  }

  // ---------- devices ----------
  listDevices() { return this.deviceRepo.find(); }
  async getDevice(id: string) {
    const entity = await this.deviceRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('设备不存在');
    return entity;
  }
  async controlDevice(id: string, action: string, value?: boolean) {
    const entity = await this.deviceRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('设备不存在');
    if (action === 'power') {
      entity.power = value !== undefined ? value : !entity.power;
      entity.online = entity.power;
    } else if (action === 'flush') {
      entity.flushing = value !== undefined ? value : true;
    } else if (action === 'reset') {
      entity.filterLife = 100;
      entity.flushing = false;
    }
    return this.deviceRepo.save(entity);
  }

  // ---------- device models ----------
  listDeviceModels() { return this.deviceModelRepo.find({ order: { id: 'ASC' } }); }
  async createDeviceModel(body: Partial<AdminDeviceModel>) {
    const entity = this.deviceModelRepo.create({ count: 0, status: '在售', filters: 0, price: 0, ...body, id: undefined });
    return this.deviceModelRepo.save(entity);
  }
  async updateDeviceModel(id: number, body: Partial<AdminDeviceModel>) {
    const entity = await this.deviceModelRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('型号不存在');
    Object.assign(entity, body, { id });
    return this.deviceModelRepo.save(entity);
  }
  async deleteDeviceModel(id: number) {
    await this.deviceModelRepo.delete(id);
    return null;
  }

  // ---------- workorders ----------
  listWorkorders() { return this.workorderRepo.find({ order: { createTime: 'DESC' } }); }
  async getWorkorder(id: string) {
    const entity = await this.workorderRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('工单不存在');
    return entity;
  }
  async dispatchWorkorder(id: string, technician: string) {
    const entity = await this.workorderRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('工单不存在');
    entity.technician = technician;
    if (entity.status === '已下单') entity.status = '已派单';
    const tl = Array.isArray(entity.timeline) ? entity.timeline : [];
    const hasDispatch = tl.some((t: any) => t.status === '已派单');
    if (!hasDispatch) {
      tl.push({
        status: '已派单',
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
        desc: `已指派给 ${technician}`,
      });
      entity.timeline = tl;
    }
    return this.workorderRepo.save(entity);
  }

  // ---------- technicians ----------
  listTechnicians() { return this.technicianRepo.find(); }
  async createTechnician(body: Partial<AdminTechnician>) {
    const id = body.id || 'TECH' + Date.now();
    const entity = this.technicianRepo.create({
      online: true, rating: 5, ongoing: 0, totalOrders: 0, level: '认证师傅',
      joinDate: new Date().toISOString().slice(0, 10),
      ...body, id,
    });
    return this.technicianRepo.save(entity);
  }
  async updateTechnician(id: string, body: Partial<AdminTechnician>) {
    const entity = await this.technicianRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('师傅不存在');
    Object.assign(entity, body, { id });
    return this.technicianRepo.save(entity);
  }
  async deleteTechnician(id: string) {
    await this.technicianRepo.delete(id);
    return null;
  }
  async setTechnicianOnline(id: string, online: boolean) {
    const entity = await this.technicianRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('师傅不存在');
    entity.online = online;
    return this.technicianRepo.save(entity);
  }

  // ---------- distribution ----------
  distOverview() { return this.getMetric('distribution.overview', {}); }
  listDistributors() { return this.distributorRepo.find(); }
  listCommissions() { return this.commissionRepo.find(); }
  listWithdrawals() { return this.withdrawalRepo.find(); }
  async auditWithdrawal(id: string, status: string, remark?: string) {
    const entity = await this.withdrawalRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('提现记录不存在');
    entity.status = status;
    if (remark !== undefined) entity.remark = remark;
    return this.withdrawalRepo.save(entity);
  }
  listDistRules() { return this.distRuleRepo.find({ order: { id: 'ASC' } }); }
  async saveDistRules(rules: AdminDistRule[]) {
    await this.distRuleRepo.save(rules);
    return this.distRuleRepo.find({ order: { id: 'ASC' } });
  }

  // ---------- customers ----------
  listCustomers() { return this.customerRepo.find(); }
  async getCustomer(id: string) {
    const entity = await this.customerRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('客户不存在');
    return entity;
  }

  // ---------- recharge ----------
  listRechargePackages() { return this.rechargePackageRepo.find({ order: { id: 'ASC' } }); }
  async createRechargePackage(body: Partial<AdminRechargePackage>) {
    const entity = this.rechargePackageRepo.create({
      gift: 0, sales: 0, enabled: true, tag: '', desc: '', amount: 0,
      ...body, id: undefined,
    });
    return this.rechargePackageRepo.save(entity);
  }
  async updateRechargePackage(id: number, body: Partial<AdminRechargePackage>) {
    const entity = await this.rechargePackageRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('套餐不存在');
    Object.assign(entity, body, { id });
    return this.rechargePackageRepo.save(entity);
  }
  async deleteRechargePackage(id: number) {
    await this.rechargePackageRepo.delete(id);
    return null;
  }
  listRechargeRecords() { return this.rechargeRecordRepo.find(); }
  rechargeTrend() { return this.getMetric('recharge.trend', {}); }

  // ---------- alerts ----------
  listAlerts() { return this.alertRepo.find(); }
  async handleAlert(id: string) {
    const entity = await this.alertRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('预警不存在');
    entity.status = '已处理';
    return this.alertRepo.save(entity);
  }
  listAlertRules() { return this.alertRuleRepo.find({ order: { id: 'ASC' } }); }
  async saveAlertRules(rules: AdminAlertRule[]) {
    await this.alertRuleRepo.save(rules);
    return this.alertRuleRepo.find({ order: { id: 'ASC' } });
  }

  // ---------- page config & settings ----------
  pageConfig() {
    return this.getMetric('page.config', {
      components: [],
      pageConfig: { title: '', bgColor: '' },
    });
  }
  savePageConfig(body: any) { return this.setMetric('page.config', body); }
  settings() {
    return this.getMetric('system.settings', {
      base: {}, iot: {}, wx: {}, security: {},
    });
  }
  saveSettings(body: any) { return this.setMetric('system.settings', body); }

  // ---------- 排行榜激励 ----------
  rankings(board = 'sales', scope = 'personal', period = 'month') {
    return this.rankingRepo.find({ where: { board, scope, period }, order: { rank: 'ASC' } });
  }

  // ---------- 营销-积分 ----------
  listPointRules() { return this.pointRuleRepo.find({ order: { id: 'ASC' } }); }
  async createPointRule(body: Partial<AdminPointRule>) {
    const entity = this.pointRuleRepo.create({ enabled: true, points: 0, desc: '', ...body, id: undefined });
    return this.pointRuleRepo.save(entity);
  }
  async updatePointRule(id: number, body: Partial<AdminPointRule>) {
    const entity = await this.pointRuleRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('积分规则不存在');
    Object.assign(entity, body, { id });
    return this.pointRuleRepo.save(entity);
  }
  async deletePointRule(id: number) { await this.pointRuleRepo.delete(id); return null; }
  listPointRecords() { return this.pointRecordRepo.find({ order: { time: 'DESC' } }); }

  // ---------- 库存管理 ----------
  listInventory() { return this.inventoryRepo.find({ order: { id: 'ASC' } }); }
  async createInventory(body: Partial<AdminInventory>) {
    const entity = this.inventoryRepo.create({
      stock: 0, warnLine: 0, unit: '件', location: '', category: '',
      updateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...body, id: undefined,
    });
    return this.inventoryRepo.save(entity);
  }
  async updateInventory(id: number, body: Partial<AdminInventory>) {
    const entity = await this.inventoryRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('库存不存在');
    Object.assign(entity, body, { id, updateTime: new Date().toISOString().slice(0, 16).replace('T', ' ') });
    return this.inventoryRepo.save(entity);
  }
  async deleteInventory(id: number) { await this.inventoryRepo.delete(id); return null; }
  listStockLogs() { return this.stockLogRepo.find({ order: { time: 'DESC' } }); }
  async stockInOut(body: { sku: string; type: string; qty: number; operator?: string; remark?: string }) {
    const inv = await this.inventoryRepo.findOne({ where: { sku: body.sku } });
    if (!inv) throw new NotFoundException('库存商品不存在');
    const qty = Number(body.qty) || 0;
    inv.stock = body.type === 'in' ? inv.stock + qty : Math.max(0, inv.stock - qty);
    inv.updateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    await this.inventoryRepo.save(inv);
    const log = this.stockLogRepo.create({
      id: 'STK' + Date.now(), sku: inv.sku, name: inv.name, type: body.type, qty,
      operator: body.operator || '管理员', remark: body.remark || '',
      time: inv.updateTime,
    });
    await this.stockLogRepo.save(log);
    return inv;
  }

  // ---------- 系统：角色 / 账号 / 操作日志 / 站内消息 ----------
  listRoles() { return this.roleRepo.find({ order: { id: 'ASC' } }); }
  async createRole(body: Partial<AdminRole>) {
    const entity = this.roleRepo.create({
      permissions: [], desc: '', status: 'enabled',
      createTime: new Date().toISOString().slice(0, 10),
      ...body, id: undefined,
    });
    return this.roleRepo.save(entity);
  }
  async updateRole(id: number, body: Partial<AdminRole>) {
    const entity = await this.roleRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('角色不存在');
    Object.assign(entity, body, { id });
    return this.roleRepo.save(entity);
  }
  async deleteRole(id: number) { await this.roleRepo.delete(id); return null; }

  listAccounts() { return this.accountRepo.find({ order: { createTime: 'DESC' } }); }
  async createAccount(body: Partial<AdminAccount>) {
    const id = body.id || 'U' + Date.now();
    const entity = this.accountRepo.create({
      status: 'enabled', lastLogin: '',
      createTime: new Date().toISOString().slice(0, 10),
      ...body, id,
    });
    return this.accountRepo.save(entity);
  }
  async updateAccount(id: string, body: Partial<AdminAccount>) {
    const entity = await this.accountRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('账号不存在');
    Object.assign(entity, body, { id });
    return this.accountRepo.save(entity);
  }
  async deleteAccount(id: string) { await this.accountRepo.delete(id); return null; }

  listOpLogs() { return this.opLogRepo.find({ order: { time: 'DESC' } }); }

  listNotices() { return this.noticeRepo.find({ order: { time: 'DESC' } }); }
  async readNotice(id: string) {
    const entity = await this.noticeRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('消息不存在');
    entity.status = 'read';
    return this.noticeRepo.save(entity);
  }

  // ---------- 消息通知模板 ----------
  listMsgTemplates() { return this.msgTemplateRepo.find({ order: { id: 'ASC' } }); }
  async createMsgTemplate(body: Partial<AdminMsgTemplate>) {
    const entity = this.msgTemplateRepo.create({ status: 'enabled', channel: 'wx', ...body, id: undefined });
    return this.msgTemplateRepo.save(entity);
  }
  async updateMsgTemplate(id: number, body: Partial<AdminMsgTemplate>) {
    const entity = await this.msgTemplateRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('模板不存在');
    Object.assign(entity, body, { id });
    return this.msgTemplateRepo.save(entity);
  }
  async deleteMsgTemplate(id: number) { await this.msgTemplateRepo.delete(id); return null; }

  // ---------- 师傅审核 ----------
  listTechApplies() { return this.techApplyRepo.find({ order: { applyTime: 'DESC' } }); }
  async auditTechApply(id: string, status: string, remark?: string) {
    const entity = await this.techApplyRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('申请不存在');
    entity.status = status;
    if (remark !== undefined) entity.remark = remark;
    // 审核通过则自动转入师傅库
    if (status === 'approved') {
      const exist = await this.technicianRepo.findOne({ where: { phone: entity.phone } });
      if (!exist) {
        await this.technicianRepo.save(this.technicianRepo.create({
          id: 'TECH' + Date.now(), name: entity.name, phone: entity.phone, area: entity.area,
          online: true, rating: 5, ongoing: 0, totalOrders: 0, level: '认证师傅',
          joinDate: new Date().toISOString().slice(0, 10),
        }));
      }
    }
    return this.techApplyRepo.save(entity);
  }

  // ---------- 设备：故障 / 校准 / 制水记录 ----------
  listDeviceFaults() { return this.deviceFaultRepo.find({ order: { time: 'DESC' } }); }
  async handleDeviceFault(id: string, status: string) {
    const entity = await this.deviceFaultRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('故障记录不存在');
    entity.status = status;
    return this.deviceFaultRepo.save(entity);
  }
  listDeviceCalibrations() { return this.deviceCalibrationRepo.find({ order: { time: 'DESC' } }); }
  listWaterRecords() { return this.waterRecordRepo.find({ order: { date: 'DESC' } }); }

  // ---------- 在线客服 ----------
  listChatSessions() { return this.chatSessionRepo.find({ order: { updateTime: 'DESC' } }); }
  async getChatSession(id: string) {
    const entity = await this.chatSessionRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('会话不存在');
    return entity;
  }
  async replyChat(id: string, text: string) {
    const entity = await this.chatSessionRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('会话不存在');
    const msgs = Array.isArray(entity.messages) ? entity.messages : [];
    msgs.push({ from: 'agent', text, time: new Date().toISOString().slice(11, 16) });
    entity.messages = msgs;
    entity.lastMsg = text;
    entity.unread = 0;
    entity.updateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    return this.chatSessionRepo.save(entity);
  }
  async closeChat(id: string) {
    const entity = await this.chatSessionRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('会话不存在');
    entity.status = 'closed';
    return this.chatSessionRepo.save(entity);
  }

  // ---------- 支付管理 ----------
  listPaymentRecords() { return this.paymentRecordRepo.find({ order: { time: 'DESC' } }); }
  async refundPayment(id: string) {
    const entity = await this.paymentRecordRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('支付流水不存在');
    entity.status = 'refund';
    return this.paymentRecordRepo.save(entity);
  }

  // ---------- 商品套餐 ----------
  listPackages() { return this.packageRepo.find({ order: { id: 'ASC' } }); }
  async createPackage(body: Partial<AdminPackage>) {
    const entity = this.packageRepo.create({
      items: [], price: 0, originPrice: 0, sales: 0, status: 'enabled', desc: '',
      ...body, id: undefined,
    });
    return this.packageRepo.save(entity);
  }
  async updatePackage(id: number, body: Partial<AdminPackage>) {
    const entity = await this.packageRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('套餐不存在');
    Object.assign(entity, body, { id });
    return this.packageRepo.save(entity);
  }
  async deletePackage(id: number) { await this.packageRepo.delete(id); return null; }

  // ---------- 分销体系（链动2+1/邀请/阶梯/区域分红 配置） ----------
  distSystem() { return this.getMetric('distribution.system', {}); }
  saveDistSystem(body: any) { return this.setMetric('distribution.system', body); }
  listRegionDividends() { return this.regionDividendRepo.find(); }
  async updateRegionDividend(id: string, body: Partial<AdminRegionDividend>) {
    const entity = await this.regionDividendRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('区域分红不存在');
    Object.assign(entity, body, { id });
    return this.regionDividendRepo.save(entity);
  }

  // ---------- 续费统计 ----------
  renewalData() { return this.getMetric('data.renewal', {}); }
}
