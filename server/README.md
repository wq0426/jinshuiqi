# 净水器平台 后端服务（NestJS + TypeORM + MySQL）

为「管理后台」与「微信小程序」提供全部接口。数据存 MySQL，由 seed 脚本写入。

## 环境要求
- Node.js 18+
- MySQL 8.x（已建库 `jinshuiqi`）

## 配置
编辑 `.env`（默认值已对接本机 MySQL）：
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=jinshuiqi
PORT=3000
```
建库（若未建）：
```sql
CREATE DATABASE IF NOT EXISTS jinshuiqi DEFAULT CHARACTER SET utf8mb4;
```

## 启动
```bash
npm install
npm run seed        # 填充 mock 数据到 MySQL（可重复执行，会重建表）
npm run start:dev   # 启动开发服务，监听 http://localhost:3000/api
```

## 接口约定
- 统一前缀 `/api`，已开启 CORS。
- 管理后台接口前缀 `/api/admin`，小程序接口前缀 `/api/wx`。
- 统一响应信封：`{ code: 0, message: 'success', data }`；异常 `{ code, message, data: null }`。
- 完整接口清单见根目录 `docs/API_CONTRACT.md`。

## 结构
```
src/
├── main.ts                     # 启动入口（全局前缀/拦截器/过滤器）
├── app.module.ts               # 根模块（TypeORM + Admin + Wx）
├── config/data-source.ts       # 数据库连接配置 + seed 用 DataSource
├── common/                     # 响应拦截器 + 异常过滤器
├── entities/                   # admin / wx / metric 实体（嵌套字段用 JSON 列）
├── database/seed.ts            # 数据填充脚本（移植自前端 mock）
└── modules/
    ├── admin/                  # 管理后台 controller + service
    └── wx/                     # 小程序 controller + service
```

## 数据模型说明
- 行级业务数据（商品/订单/设备/工单/客户/分销/预警/充值等）用真实关系表，嵌套结构（订单明细、物流、时间线、用水曲线等）用 MySQL `json` 列。
- 聚合类数据（工作台指标、数据中心图表、数据大屏、分销概览、首页装修配置等）存通用 `metric(key, data json)` 表，按 key 读取整块 JSON。
