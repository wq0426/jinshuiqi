import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from '../../common/admin-auth.guard';
import { Public } from '../../common/public.decorator';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  // ---------- 鉴权 ----------
  @Public()
  @Post('auth/login')
  login(@Body() body: { username?: string; password?: string }) {
    return this.svc.login(body?.username, body?.password);
  }

  // ---------- 工作台 ----------
  @Get('dashboard/stat-cards') statCards() { return this.svc.statCards(); }
  @Get('dashboard/revenue-trend') revenueTrend() { return this.svc.revenueTrend(); }
  @Get('dashboard/workorder-status') workorderStatus() { return this.svc.workorderStatus(); }
  @Get('dashboard/todos') todos() { return this.svc.todos(); }
  @Get('dashboard/latest-workorders') latestWorkorders() { return this.svc.latestWorkorders(); }

  // ---------- 数据中心 ----------
  @Get('data/install') installData() { return this.svc.installData(); }
  @Get('data/recharge') rechargeAnalysis() { return this.svc.rechargeAnalysis(); }
  @Get('data/customer') customerAnalysis() { return this.svc.customerAnalysis(); }
  @Get('data/screen') screenData() { return this.svc.screenData(); }

  // ---------- 商城：分类 ----------
  @Get('categories') listCategories() { return this.svc.listCategories(); }
  @Post('categories') createCategory(@Body() b: any) { return this.svc.createCategory(b); }
  @Put('categories/:id') updateCategory(@Param('id') id: string, @Body() b: any) { return this.svc.updateCategory(+id, b); }
  @Delete('categories/:id') deleteCategory(@Param('id') id: string) { return this.svc.deleteCategory(+id); }

  // ---------- 商城：商品 ----------
  @Get('products') listProducts() { return this.svc.listProducts(); }
  @Post('products') createProduct(@Body() b: any) { return this.svc.createProduct(b); }
  @Put('products/:id') updateProduct(@Param('id') id: string, @Body() b: any) { return this.svc.updateProduct(+id, b); }
  @Delete('products/:id') deleteProduct(@Param('id') id: string) { return this.svc.deleteProduct(+id); }
  @Patch('products/:id/sale') setProductSale(@Param('id') id: string, @Body() b: { onSale: boolean }) { return this.svc.setProductSale(+id, b.onSale); }

  // ---------- 商城：订单 ----------
  @Get('orders') listOrders() { return this.svc.listOrders(); }
  @Get('orders/:id') getOrder(@Param('id') id: string) { return this.svc.getOrder(id); }

  // ---------- 设备 ----------
  @Get('device-models') listDeviceModels() { return this.svc.listDeviceModels(); }
  @Post('device-models') createDeviceModel(@Body() b: any) { return this.svc.createDeviceModel(b); }
  @Put('device-models/:id') updateDeviceModel(@Param('id') id: string, @Body() b: any) { return this.svc.updateDeviceModel(+id, b); }
  @Delete('device-models/:id') deleteDeviceModel(@Param('id') id: string) { return this.svc.deleteDeviceModel(+id); }
  @Get('devices') listDevices() { return this.svc.listDevices(); }
  @Get('devices/:id') getDevice(@Param('id') id: string) { return this.svc.getDevice(id); }
  @Post('devices/:id/control') controlDevice(@Param('id') id: string, @Body() b: { action: string; value?: boolean }) { return this.svc.controlDevice(id, b.action, b.value); }

  // ---------- 工单 ----------
  @Get('workorders') listWorkorders() { return this.svc.listWorkorders(); }
  @Get('workorders/:id') getWorkorder(@Param('id') id: string) { return this.svc.getWorkorder(id); }
  @Post('workorders/:id/dispatch') dispatchWorkorder(@Param('id') id: string, @Body() b: { technician: string }) { return this.svc.dispatchWorkorder(id, b.technician); }

  // ---------- 师傅 ----------
  @Get('technicians') listTechnicians() { return this.svc.listTechnicians(); }
  @Post('technicians') createTechnician(@Body() b: any) { return this.svc.createTechnician(b); }
  @Put('technicians/:id') updateTechnician(@Param('id') id: string, @Body() b: any) { return this.svc.updateTechnician(id, b); }
  @Delete('technicians/:id') deleteTechnician(@Param('id') id: string) { return this.svc.deleteTechnician(id); }
  @Patch('technicians/:id/online') setTechnicianOnline(@Param('id') id: string, @Body() b: { online: boolean }) { return this.svc.setTechnicianOnline(id, b.online); }

  // ---------- 分销 ----------
  @Get('distribution/overview') distOverview() { return this.svc.distOverview(); }
  @Get('distributors') listDistributors() { return this.svc.listDistributors(); }
  @Get('commissions') listCommissions() { return this.svc.listCommissions(); }
  @Get('withdrawals') listWithdrawals() { return this.svc.listWithdrawals(); }
  @Post('withdrawals/:id/audit') auditWithdrawal(@Param('id') id: string, @Body() b: { status: string; remark?: string }) { return this.svc.auditWithdrawal(id, b.status, b.remark); }
  @Get('dist-rules') listDistRules() { return this.svc.listDistRules(); }
  @Put('dist-rules') saveDistRules(@Body() b: any) { return this.svc.saveDistRules(b); }

  // ---------- 客户 ----------
  @Get('customers') listCustomers() { return this.svc.listCustomers(); }
  @Get('customers/:id') getCustomer(@Param('id') id: string) { return this.svc.getCustomer(id); }

  // ---------- 充值 ----------
  @Get('recharge/packages') listRechargePackages() { return this.svc.listRechargePackages(); }
  @Post('recharge/packages') createRechargePackage(@Body() b: any) { return this.svc.createRechargePackage(b); }
  @Put('recharge/packages/:id') updateRechargePackage(@Param('id') id: string, @Body() b: any) { return this.svc.updateRechargePackage(+id, b); }
  @Delete('recharge/packages/:id') deleteRechargePackage(@Param('id') id: string) { return this.svc.deleteRechargePackage(+id); }
  @Get('recharge/records') listRechargeRecords() { return this.svc.listRechargeRecords(); }
  @Get('recharge/trend') rechargeTrend() { return this.svc.rechargeTrend(); }

  // ---------- 预警 ----------
  @Get('alerts') listAlerts() { return this.svc.listAlerts(); }
  @Post('alerts/:id/handle') handleAlert(@Param('id') id: string) { return this.svc.handleAlert(id); }
  @Get('alert-rules') listAlertRules() { return this.svc.listAlertRules(); }
  @Put('alert-rules') saveAlertRules(@Body() b: any) { return this.svc.saveAlertRules(b); }

  // ---------- 页面装修 / 系统设置 ----------
  @Get('page-config') pageConfig() { return this.svc.pageConfig(); }
  @Put('page-config') savePageConfig(@Body() b: any) { return this.svc.savePageConfig(b); }
  @Get('settings') settings() { return this.svc.settings(); }
  @Put('settings') saveSettings(@Body() b: any) { return this.svc.saveSettings(b); }

  // ---------- 排行榜激励 ----------
  @Get('rankings') rankings(@Query('board') board: string, @Query('scope') scope: string, @Query('period') period: string) {
    return this.svc.rankings(board || 'sales', scope || 'personal', period || 'month');
  }

  // ---------- 营销-积分 ----------
  @Get('point-rules') listPointRules() { return this.svc.listPointRules(); }
  @Post('point-rules') createPointRule(@Body() b: any) { return this.svc.createPointRule(b); }
  @Put('point-rules/:id') updatePointRule(@Param('id') id: string, @Body() b: any) { return this.svc.updatePointRule(+id, b); }
  @Delete('point-rules/:id') deletePointRule(@Param('id') id: string) { return this.svc.deletePointRule(+id); }
  @Get('point-records') listPointRecords() { return this.svc.listPointRecords(); }

  // ---------- 库存管理 ----------
  @Get('inventory') listInventory() { return this.svc.listInventory(); }
  @Post('inventory') createInventory(@Body() b: any) { return this.svc.createInventory(b); }
  @Put('inventory/:id') updateInventory(@Param('id') id: string, @Body() b: any) { return this.svc.updateInventory(+id, b); }
  @Delete('inventory/:id') deleteInventory(@Param('id') id: string) { return this.svc.deleteInventory(+id); }
  @Get('stock-logs') listStockLogs() { return this.svc.listStockLogs(); }
  @Post('stock-inout') stockInOut(@Body() b: any) { return this.svc.stockInOut(b); }

  // ---------- 系统：角色 / 账号 / 操作日志 / 站内消息 ----------
  @Get('roles') listRoles() { return this.svc.listRoles(); }
  @Post('roles') createRole(@Body() b: any) { return this.svc.createRole(b); }
  @Put('roles/:id') updateRole(@Param('id') id: string, @Body() b: any) { return this.svc.updateRole(+id, b); }
  @Delete('roles/:id') deleteRole(@Param('id') id: string) { return this.svc.deleteRole(+id); }
  @Get('accounts') listAccounts() { return this.svc.listAccounts(); }
  @Post('accounts') createAccount(@Body() b: any) { return this.svc.createAccount(b); }
  @Put('accounts/:id') updateAccount(@Param('id') id: string, @Body() b: any) { return this.svc.updateAccount(id, b); }
  @Delete('accounts/:id') deleteAccount(@Param('id') id: string) { return this.svc.deleteAccount(id); }
  @Get('op-logs') listOpLogs() { return this.svc.listOpLogs(); }
  @Get('notices') listNotices() { return this.svc.listNotices(); }
  @Post('notices/:id/read') readNotice(@Param('id') id: string) { return this.svc.readNotice(id); }

  // ---------- 消息通知模板 ----------
  @Get('msg-templates') listMsgTemplates() { return this.svc.listMsgTemplates(); }
  @Post('msg-templates') createMsgTemplate(@Body() b: any) { return this.svc.createMsgTemplate(b); }
  @Put('msg-templates/:id') updateMsgTemplate(@Param('id') id: string, @Body() b: any) { return this.svc.updateMsgTemplate(+id, b); }
  @Delete('msg-templates/:id') deleteMsgTemplate(@Param('id') id: string) { return this.svc.deleteMsgTemplate(+id); }

  // ---------- 师傅审核 ----------
  @Get('tech-applies') listTechApplies() { return this.svc.listTechApplies(); }
  @Post('tech-applies/:id/audit') auditTechApply(@Param('id') id: string, @Body() b: { status: string; remark?: string }) { return this.svc.auditTechApply(id, b.status, b.remark); }

  // ---------- 设备：故障 / 校准 / 制水记录 ----------
  @Get('device-faults') listDeviceFaults() { return this.svc.listDeviceFaults(); }
  @Post('device-faults/:id/handle') handleDeviceFault(@Param('id') id: string, @Body() b: { status: string }) { return this.svc.handleDeviceFault(id, b.status); }
  @Get('device-calibrations') listDeviceCalibrations() { return this.svc.listDeviceCalibrations(); }
  @Get('water-records') listWaterRecords() { return this.svc.listWaterRecords(); }

  // ---------- 在线客服 ----------
  @Get('chat-sessions') listChatSessions() { return this.svc.listChatSessions(); }
  @Get('chat-sessions/:id') getChatSession(@Param('id') id: string) { return this.svc.getChatSession(id); }
  @Post('chat-sessions/:id/reply') replyChat(@Param('id') id: string, @Body() b: { text: string }) { return this.svc.replyChat(id, b.text); }
  @Post('chat-sessions/:id/close') closeChat(@Param('id') id: string) { return this.svc.closeChat(id); }

  // ---------- 支付管理 ----------
  @Get('payment-records') listPaymentRecords() { return this.svc.listPaymentRecords(); }
  @Post('payment-records/:id/refund') refundPayment(@Param('id') id: string) { return this.svc.refundPayment(id); }

  // ---------- 商品套餐 ----------
  @Get('packages') listPackages() { return this.svc.listPackages(); }
  @Post('packages') createPackage(@Body() b: any) { return this.svc.createPackage(b); }
  @Put('packages/:id') updatePackage(@Param('id') id: string, @Body() b: any) { return this.svc.updatePackage(+id, b); }
  @Delete('packages/:id') deletePackage(@Param('id') id: string) { return this.svc.deletePackage(+id); }

  // ---------- 分销体系 / 区域分红 ----------
  @Get('dist-system') distSystem() { return this.svc.distSystem(); }
  @Put('dist-system') saveDistSystem(@Body() b: any) { return this.svc.saveDistSystem(b); }
  @Get('region-dividends') listRegionDividends() { return this.svc.listRegionDividends(); }
  @Put('region-dividends/:id') updateRegionDividend(@Param('id') id: string, @Body() b: any) { return this.svc.updateRegionDividend(id, b); }

  // ---------- 续费统计 ----------
  @Get('data/renewal') renewalData() { return this.svc.renewalData(); }
}
