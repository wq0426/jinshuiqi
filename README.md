项目背景
我想要实现一套净水器上门服务小程序开发，包含小程序和后台。

项目功能：
1.净水器是物联网设备需要调用厂家的api接口；
2.商城的基本功能；
3.服务工单的功能:师傅管理，派单，跟单，装机，拆机，迁机，返库；
4.分销功能，链动2+1；
5.前端页面能自定义；
6.数据中心:数据大屏，装机数据，充值数据，客户数据等等；
7.预警管理；

---

# 实现说明

本仓库实现了完整的三层架构：**NestJS + MySQL 后端** + 「管理后台」+ 「微信小程序」，覆盖上述 7 大功能模块。
> 所有数据均来自 **MySQL 数据库**（由 seed 脚本写入），前端通过 HTTP 接口拉取，**不再使用任何本地静态/mock 数据**。

## 目录结构
```
jinshuiqi/
├── server/        # 后端 (NestJS + TypeORM + MySQL)
├── admin/         # 管理后台 (Vue3 + Vite + Element Plus + ECharts + Pinia + axios)
├── miniprogram/   # 微信小程序 (原生)
└── docs/API_CONTRACT.md   # 全部接口契约（前后端唯一真源）
```

## 启动顺序（先起后端）

### 0. 后端 server（必须先启动）
```bash
cd server
# 确保本机 MySQL 运行，并已建库：CREATE DATABASE jinshuiqi DEFAULT CHARACTER SET utf8mb4;
# 默认连接 root/root@127.0.0.1:3306，可在 server/.env 修改
npm install
npm run seed        # 写入演示数据到 MySQL
npm run start:dev   # 监听 http://localhost:3100/api
```
接口前缀：管理后台 `/api/admin/*`，小程序 `/api/wx/*`，统一信封 `{ code, message, data }`。

## 一、管理后台 admin

技术栈：Vue3 `<script setup>` + Vite + Element Plus + Vue Router + Pinia + ECharts + axios。

启动（需后端已运行）：
```bash
cd admin
npm install
npm run dev        # 默认 http://localhost:8000，已配置 /api 代理到 localhost:3100
```
登录账号默认 **admin / 123456**（可在 `server/.env` 的 `ADMIN_USERNAME`/`ADMIN_PASSWORD` 修改）。后端 `/api/admin/auth/login` 校验账号密码并签发 token；所有 `/api/admin/*` 接口经 `AdminAuthGuard` 鉴权，无有效 token 返回 401。
数据通过 `src/api/` 调用后端接口；UI 标签颜色等展示常量在 `src/constants/`。

页面覆盖：
- **数据中心**：数据大屏（深色炫酷大屏 + 多图表）、装机/充值/客户数据分析
- **商城管理**：商品列表（增删改查/上下架/分页）、商品分类、订单管理
- **设备管理(IoT)**：设备列表、设备详情（实时状态 + 远程控制开关）、设备型号
- **服务工单**：工单列表、派单中心、工单详情（状态时间线）、师傅管理
- **分销管理(链动2+1)**：概览、分销员、佣金记录、提现审核、分润规则配置
- **客户管理**：客户列表 / 详情
- **充值管理**：充值套餐、充值记录
- **页面装修**：三栏可视化装修器（组件库 / 手机实时预览 / 属性配置）
- **预警管理**：预警列表（按类型筛选/处理）、预警规则配置

## 二、微信小程序 miniprogram

技术栈：原生微信小程序，自定义 tabBar（emoji 图标，免 PNG），通过 `utils/api.js` 调用后端 `/api/wx/*` 接口。

运行（需后端已运行）：用**微信开发者工具** → 导入项目 → 选择 `miniprogram/` 目录 → 编译预览。
> 接口默认指向 `http://localhost:3100/api`（见 `utils/api.js` 的 `BASE`）。开发者工具中需保持「不校验合法域名」（`project.config.json` 已设 `urlCheck:false`）才能访问 localhost。

页面覆盖（16 个页面）：
- tab 页：首页（自定义装修风格）、商城、服务、我的
- 商品详情 / 购物车 / 确认订单 / 订单列表 / 订单详情
- 我的设备 / 设备控制（IoT 实时面板 + 远程开关）
- 服务预约 / 工单详情、分销中心（链动 2+1）、充值、地址管理

## 主题
统一水蓝渐变主色 `#3A8EF6 → #26C6DA`，圆角卡片 + 柔和阴影，清新科技风。