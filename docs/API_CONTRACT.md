# 净水器平台 API 契约（前后端唯一真源）

后端：NestJS + TypeORM + MySQL。所有数据存 MySQL，由 seed 脚本写入（数据来源 = 现有 mock 文件，形状保持一致）。

## 通用约定
- Base URL：`http://localhost:3000/api`
- 统一响应信封：成功 `{ "code": 0, "message": "success", "data": <payload> }`；失败 `{ "code": <非0>, "message": "<错误信息>", "data": null }`
- 前端请求层负责拆信封：成功返回 `data`，失败 reject（弹错误提示）。
- 列表接口一律返回**完整数组**（前端页面自行本地筛选/分页，保持页面逻辑不变）。
- 鉴权：admin 登录返回 token；接口可不强校验（演示用），但登录接口必须实现。
- CORS 全开。`data: <payload>` 的形状 **必须等于** 对应 mock 文件里同名导出的结构（字段名/类型完全一致）。

> 「形状参考」列指向真源 mock 文件中的导出名，后端 seed 直接移植其生成逻辑，使返回值逐字段一致。

---

## A. 管理后台接口（前缀 `/api/admin`）

### 鉴权
| 方法 | 路径 | 入参 | 返回 data |
|---|---|---|---|
| POST | `/admin/auth/login` | `{username,password}` | `{ token:string, user:{username,nickname,role,avatar} }`（任意账号密码均通过）|

### 工作台 dashboard（形状参考 `admin/src/mock/dashboard.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/dashboard/stat-cards` | `statCards` 数组 |
| GET | `/admin/dashboard/revenue-trend` | `revenueTrend` 对象 |
| GET | `/admin/dashboard/workorder-status` | `workorderStatus` 数组 |
| GET | `/admin/dashboard/todos` | `todoList` 数组 |
| GET | `/admin/dashboard/latest-workorders` | `latestWorkorders` 数组 |

### 数据中心（形状参考 `admin/src/mock/dataCenter.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/data/install` | `installData` |
| GET | `/admin/data/recharge` | `rechargeAnalysis` |
| GET | `/admin/data/customer` | `customerAnalysis` |
| GET | `/admin/data/screen` | `screenData` |

### 商城（形状参考 `admin/src/mock/products.js` `orders.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/categories` | `categories` 数组 |
| POST | `/admin/categories` | 新建分类，返回该分类 |
| PUT | `/admin/categories/:id` | 更新，返回该分类 |
| DELETE | `/admin/categories/:id` | `null` |
| GET | `/admin/products` | `products` 数组（全量）|
| POST | `/admin/products` | 新建商品，返回该商品（id 由后端生成）|
| PUT | `/admin/products/:id` | 更新，返回该商品 |
| DELETE | `/admin/products/:id` | `null` |
| PATCH | `/admin/products/:id/sale` | 入参 `{onSale:boolean}`，返回该商品 |
| GET | `/admin/orders` | `orders` 数组（含 items、logistics 嵌套）|
| GET | `/admin/orders/:id` | 单个订单 |

### 设备（形状参考 `admin/src/mock/devices.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/devices` | `devices` 数组 |
| GET | `/admin/devices/:id` | 单个设备（含 waterCurve）|
| POST | `/admin/devices/:id/control` | 入参 `{action:'power'|'flush'|'reset', value?:boolean}`，返回更新后的设备状态 |
| GET | `/admin/device-models` | `deviceModels` 数组 |
| POST/PUT/DELETE | `/admin/device-models[/:id]` | 增改删 |

### 工单（形状参考 `admin/src/mock/workorders.js` `technicians.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/workorders` | `workorders` 数组（含 timeline、photos）|
| GET | `/admin/workorders/:id` | 单个工单 |
| POST | `/admin/workorders/:id/dispatch` | 入参 `{technician:string}`，返回更新后的工单 |
| GET | `/admin/technicians` | `technicians` 数组 |
| POST/PUT/DELETE | `/admin/technicians[/:id]` | 增改删 |
| PATCH | `/admin/technicians/:id/online` | 入参 `{online:boolean}` |

### 分销 链动2+1（形状参考 `admin/src/mock/distributors.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/distribution/overview` | `distOverview` |
| GET | `/admin/distributors` | `distributors` 数组 |
| GET | `/admin/commissions` | `commissions` 数组 |
| GET | `/admin/withdrawals` | `withdrawals` 数组 |
| POST | `/admin/withdrawals/:id/audit` | 入参 `{status:'已通过'|'已驳回', remark?}`，返回更新后的记录 |
| GET | `/admin/dist-rules` | `distRules` 数组 |
| PUT | `/admin/dist-rules` | 入参规则数组，返回保存后的数组 |

### 客户（形状参考 `admin/src/mock/customers.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/customers` | `customers` 数组（含 devices/orders/workorders 嵌套）|
| GET | `/admin/customers/:id` | 单个客户 |

### 充值（形状参考 `admin/src/mock/recharge.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/recharge/packages` | `rechargePackages` 数组 |
| POST/PUT/DELETE | `/admin/recharge/packages[/:id]` | 增改删 |
| GET | `/admin/recharge/records` | `rechargeRecords` 数组 |
| GET | `/admin/recharge/trend` | `rechargeTrend` |

### 预警（形状参考 `admin/src/mock/alerts.js`）
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/alerts` | `alerts` 数组 |
| POST | `/admin/alerts/:id/handle` | 标记已处理，返回更新后的预警 |
| GET | `/admin/alert-rules` | `alertRules` 数组 |
| PUT | `/admin/alert-rules` | 入参规则数组，返回保存后的数组 |

### 页面装修 / 系统设置
| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/admin/page-config` | `{ components:[], pageConfig:{title,bgColor} }`（无则返回默认空）|
| PUT | `/admin/page-config` | 保存并回显 |
| GET | `/admin/settings` | `{ base, iot, wx, security }` |
| PUT | `/admin/settings` | 保存并回显 |

> 颜色/标签映射（如 `orderStatusType`、`workorderTypeColor`、`alertTypeColor`、`distributorLevelColor`、`customerLevelColor`、`commissionStatusColor`、`withdrawStatusColor`、`rechargeStatusColor`、`alertLevelColor`、`workorderStatusColor`、`workorderTypes`、`workorderStatuses`）属于**前端展示常量**，不走接口：迁移到 `admin/src/constants/` 下，由页面 import。

---

## B. 微信小程序接口（前缀 `/api/wx`，形状参考 `miniprogram/utils/mock.js`）

| 方法 | 路径 | 返回 data |
|---|---|---|
| GET | `/wx/banners` | `banners` |
| GET | `/wx/grids` | `grids` |
| GET | `/wx/categories` | `categories` |
| GET | `/wx/products` | `products`（全量，页面本地按 cat 筛选）|
| GET | `/wx/products/:id` | `{ ...product, specs: productSpecs }` |
| GET | `/wx/devices` | `devices` |
| GET | `/wx/devices/:id` | 单个设备（含 filters）|
| POST | `/wx/devices/:id/control` | 入参 `{action,value?}`，返回 ok |
| GET | `/wx/water-chart` | `waterChart` |
| GET | `/wx/service-types` | `serviceTypes` |
| GET | `/wx/workorders` | `workOrders` |
| GET | `/wx/workorders/:id` | 单个工单（含 timeline、master）|
| POST | `/wx/workorders` | 新建预约工单，返回创建结果 |
| GET | `/wx/orders` | `orders` |
| GET | `/wx/orders/:id` | 单个订单 |
| GET | `/wx/order-tabs` | `orderTabs` |
| GET | `/wx/distribution` | `distribution` 对象 |
| GET | `/wx/recharge-packages` | `rechargePackages`（wx 版）|
| POST | `/wx/recharge` | 入参 `{packageId/amount}`，返回 ok |
| GET | `/wx/addresses` | `addresses` |
| POST/PUT/DELETE | `/wx/addresses[/:id]` | 增改删 |
| GET | `/wx/my-grids` | `myGrids` |
| GET | `/wx/user` | `{ nickname, avatar, balance, points, coupons, level }`（用于「我的」头部）|
| POST | `/wx/login` | 入参 `{code}`，返回 `{ token, userInfo }`（演示返回固定用户）|

> 购物车为客户端会话态（globalData + Storage），保持本地，不走接口。
> 小程序里的 `workOrderSteps`（状态步骤文案数组）属于纯 UI 常量，可保留在前端常量中或随工单接口返回，二选一即可。
