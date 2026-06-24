import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WxService } from './wx.service';
import { WxAuthGuard } from '../../common/auth.guard';

@Controller('wx')
export class WxController {
  constructor(private readonly svc: WxService) {}

  // ---------- 首页聚合 ----------
  @Get('banners') banners() { return this.svc.banners(); }
  @Get('grids') grids() { return this.svc.grids(); }
  @Get('categories') categories() { return this.svc.categories(); }
  @Get('service-types') serviceTypes() { return this.svc.serviceTypes(); }
  @Get('order-tabs') orderTabs() { return this.svc.orderTabs(); }
  @Get('my-grids') myGrids() { return this.svc.myGrids(); }
  @Get('water-chart') waterChart() { return this.svc.waterChart(); }
  @UseGuards(WxAuthGuard)
  @Get('distribution') distribution() { return this.svc.distribution(); }
  @Get('recharge-packages') rechargePackages() { return this.svc.rechargePackages(); }

  // ---------- 商品 ----------
  @Get('products') listProducts() { return this.svc.listProducts(); }
  @Get('products/:id') getProduct(@Param('id') id: string) { return this.svc.getProduct(+id); }

  // ---------- 设备（需登录） ----------
  @UseGuards(WxAuthGuard)
  @Get('devices') listDevices() { return this.svc.listDevices(); }
  @UseGuards(WxAuthGuard)
  @Get('devices/:id') getDevice(@Param('id') id: string) { return this.svc.getDevice(id); }
  @UseGuards(WxAuthGuard)
  @Post('devices/:id/control') controlDevice(@Param('id') id: string, @Body() b: { action: string; value?: boolean }) { return this.svc.controlDevice(id, b.action, b.value); }

  // ---------- 工单（需登录） ----------
  @UseGuards(WxAuthGuard)
  @Get('workorders') listWorkorders() { return this.svc.listWorkorders(); }
  @UseGuards(WxAuthGuard)
  @Get('workorders/:id') getWorkorder(@Param('id') id: string) { return this.svc.getWorkorder(id); }
  @UseGuards(WxAuthGuard)
  @Post('workorders') createWorkorder(@Body() b: any) { return this.svc.createWorkorder(b); }

  // ---------- 订单（需登录） ----------
  @UseGuards(WxAuthGuard)
  @Get('orders') listOrders() { return this.svc.listOrders(); }
  @UseGuards(WxAuthGuard)
  @Get('orders/:id') getOrder(@Param('id') id: string) { return this.svc.getOrder(id); }

  // ---------- 充值（需登录） ----------
  @UseGuards(WxAuthGuard)
  @Post('recharge') recharge(@Body() b: any) { return this.svc.recharge(b); }

  // ---------- 地址（需登录） ----------
  @UseGuards(WxAuthGuard)
  @Get('addresses') listAddresses() { return this.svc.listAddresses(); }
  @UseGuards(WxAuthGuard)
  @Post('addresses') createAddress(@Body() b: any) { return this.svc.createAddress(b); }
  @UseGuards(WxAuthGuard)
  @Put('addresses/:id') updateAddress(@Param('id') id: string, @Body() b: any) { return this.svc.updateAddress(+id, b); }
  @UseGuards(WxAuthGuard)
  @Delete('addresses/:id') deleteAddress(@Param('id') id: string) { return this.svc.deleteAddress(+id); }

  // ---------- 用户 ----------
  @UseGuards(WxAuthGuard)
  @Get('user') user(@Req() req: any) { return this.svc.user(req.user?.uid); }
  @Post('login') login(@Body() b: any) { return this.svc.login(b); }
}
