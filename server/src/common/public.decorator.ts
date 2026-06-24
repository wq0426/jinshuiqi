import { SetMetadata } from '@nestjs/common';

// 标记某个路由为公开（跳过鉴权守卫），用于登录等接口
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
