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
  WxAddress,
  WxDevice,
  WxOrder,
  WxProduct,
  WxUser,
  WxWorkorder,
} from '../../entities/wx.entities';

@Injectable()
export class WxService {
  constructor(
    @InjectRepository(Metric) private metricRepo: Repository<Metric>,
    @InjectRepository(WxProduct) private productRepo: Repository<WxProduct>,
    @InjectRepository(WxDevice) private deviceRepo: Repository<WxDevice>,
    @InjectRepository(WxWorkorder) private workorderRepo: Repository<WxWorkorder>,
    @InjectRepository(WxOrder) private orderRepo: Repository<WxOrder>,
    @InjectRepository(WxAddress) private addressRepo: Repository<WxAddress>,
    @InjectRepository(WxUser) private userRepo: Repository<WxUser>,
  ) {}

  private async getMetric(key: string, fallback: any = null) {
    const row = await this.metricRepo.findOne({ where: { key } });
    return row ? row.data : fallback;
  }

  // ---------- 首页聚合 ----------
  banners() { return this.getMetric('wx.banners', []); }
  grids() { return this.getMetric('wx.grids', []); }
  categories() { return this.getMetric('wx.categories', []); }
  serviceTypes() { return this.getMetric('wx.serviceTypes', []); }
  orderTabs() { return this.getMetric('wx.orderTabs', []); }
  myGrids() { return this.getMetric('wx.myGrids', []); }
  waterChart() { return this.getMetric('wx.waterChart', []); }
  distribution() { return this.getMetric('wx.distribution', {}); }
  rechargePackages() { return this.getMetric('wx.rechargePackages', []); }

  // ---------- 商品 ----------
  listProducts() { return this.productRepo.find({ order: { id: 'ASC' } }); }
  async getProduct(id: number) {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('商品不存在');
    const specs = await this.getMetric('wx.productSpecs', []);
    return { ...entity, specs };
  }

  // ---------- 设备 ----------
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
      await this.deviceRepo.save(entity);
    }
    return { ok: true, action, power: entity.power };
  }

  // ---------- 工单 ----------
  listWorkorders() { return this.workorderRepo.find(); }
  async getWorkorder(id: string) {
    const entity = await this.workorderRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('工单不存在');
    return entity;
  }
  async createWorkorder(body: any) {
    const now = new Date();
    const id = 'GD' + now.getTime();
    const entity = this.workorderRepo.create({
      id,
      type: body.type || '装机',
      typeEmoji: body.typeEmoji || '🔧',
      status: 0,
      statusText: '待派单',
      device: body.device || '',
      address: body.address || '',
      time: body.time || now.toISOString().slice(0, 16).replace('T', ' '),
      fee: body.fee || 0,
      color: body.color || 'linear-gradient(135deg,#3A8EF6,#26C6DA)',
      master: null,
      timeline: [
        { text: '提交预约', time: now.toISOString().slice(5, 16).replace('T', ' '), done: true },
        { text: '等待派单', time: '', done: false },
        { text: '师傅上门中', time: '', done: false },
        { text: '开始服务', time: '', done: false },
        { text: '服务完成', time: '', done: false },
      ],
    });
    return this.workorderRepo.save(entity);
  }

  // ---------- 订单 ----------
  listOrders() { return this.orderRepo.find(); }
  async getOrder(id: string) {
    const entity = await this.orderRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('订单不存在');
    return entity;
  }

  // ---------- 充值 ----------
  recharge(body: { packageId?: number; amount?: number }) {
    return { ok: true, amount: body?.amount ?? 0, time: new Date().toISOString() };
  }

  // ---------- 地址 ----------
  listAddresses() { return this.addressRepo.find({ order: { id: 'ASC' } }); }
  async createAddress(body: Partial<WxAddress>) {
    if (body.isDefault) await this.addressRepo.update({}, { isDefault: false });
    const entity = this.addressRepo.create({ isDefault: false, tag: '家', ...body, id: undefined });
    return this.addressRepo.save(entity);
  }
  async updateAddress(id: number, body: Partial<WxAddress>) {
    const entity = await this.addressRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('地址不存在');
    if (body.isDefault) await this.addressRepo.update({}, { isDefault: false });
    Object.assign(entity, body, { id });
    return this.addressRepo.save(entity);
  }
  async deleteAddress(id: number) {
    await this.addressRepo.delete(id);
    return null;
  }

  // ---------- 用户 ----------
  // 把用户实体转成前端需要的资料结构
  private toUserInfo(u: WxUser) {
    return {
      nickname: u.nickname,
      avatar: u.avatar,
      balance: u.balance,
      points: u.points,
      coupons: u.coupons,
      level: u.level,
      phone: u.phone || '',
    };
  }

  // 返回当前登录用户资料（uid 来自 token）
  async user(uid?: number) {
    const u = uid ? await this.userRepo.findOne({ where: { id: uid } }) : null;
    if (!u) throw new UnauthorizedException('用户不存在或登录已过期');
    return this.toUserInfo(u);
  }

  // 用 openid 查/建用户
  private async upsertUser(openid: string, unionid?: string) {
    let u = await this.userRepo.findOne({ where: { openid } });
    if (!u) {
      const isDemo = openid === 'demo_openid';
      u = this.userRepo.create({
        openid,
        unionid: unionid || null,
        nickname: isDemo ? '张净享' : '微信用户',
        avatar: '😀',
        level: isDemo ? '合伙人' : '普通会员',
        balance: isDemo ? 1280.5 : 0,
        points: isDemo ? 3680 : 0,
        coupons: isDemo ? 5 : 0,
        phone: isDemo ? '138****8888' : null,
      });
      u = await this.userRepo.save(u);
    }
    return u;
  }

  // 微信一键登录：用 wx.login 的 code 换 openid，再签发本系统 token
  async login(body?: { code?: string }) {
    const appid = process.env.WX_APPID;
    const secret = process.env.WX_SECRET;
    let openid: string;
    let unionid: string | undefined;

    if (appid && secret && body?.code) {
      // 配了 AppID/Secret 且带 code → 走真实微信 jscode2session
      const url =
        `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}` +
        `&secret=${secret}&js_code=${body.code}&grant_type=authorization_code`;
      let data: any;
      try {
        const resp = await fetch(url);
        data = await resp.json();
      } catch (e) {
        throw new UnauthorizedException('无法连接微信服务器');
      }
      if (!data || data.errcode || !data.openid) {
        throw new UnauthorizedException(
          '微信登录失败: ' + (data?.errmsg || '未知错误'),
        );
      }
      openid = data.openid;
      unionid = data.unionid;
    } else {
      // 未配置微信凭证（或本地联调无 code）→ 回退到测试账号
      openid = 'demo_openid';
    }

    const u = await this.upsertUser(openid, unionid);
    const token = signToken({ uid: u.id, openid });
    return { token, userInfo: this.toUserInfo(u) };
  }
}
