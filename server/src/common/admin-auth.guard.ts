import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from './token.util';
import { IS_PUBLIC_KEY } from './public.decorator';

// 管理后台鉴权守卫：要求有效的 admin 范围 token（@Public() 标记的路由放行）
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const auth: string = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const payload = verifyToken(token);
    if (!payload || payload.scope !== 'admin') {
      throw new UnauthorizedException('未登录或登录已过期，请重新登录');
    }
    req.admin = payload;
    return true;
  }
}
