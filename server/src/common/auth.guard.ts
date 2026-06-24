import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from './token.util';

// 小程序鉴权守卫：要求请求头带有效的 Authorization: Bearer <token>
@Injectable()
export class WxAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth: string = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const payload = verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('未登录或登录已过期，请重新登录');
    }
    req.user = payload;
    return true;
  }
}
