import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'jinshuiqi',
  charset: 'utf8mb4',
  timezone: '+08:00',
  synchronize: true,
  entities: [join(__dirname, '..', 'entities', '*.entity.{ts,js}')],
};

// 用于 seed 脚本（脱离 Nest 容器直接连库）
export const AppDataSource = new DataSource(dataSourceOptions);
