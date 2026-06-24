// 轻量级签名 token：base64url(payload).HMAC-SHA256 签名，无第三方依赖
import { createHmac } from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'jsq_wx_secret_2026';
const TTL_MS = 7 * 24 * 3600 * 1000; // 7 天有效期

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sign(data: string): string {
  return b64url(createHmac('sha256', SECRET).update(data).digest());
}

// 签发 token（payload 里会自动写入过期时间 exp）
export function signToken(payload: Record<string, any>): string {
  const body = { ...payload, exp: Date.now() + TTL_MS };
  const data = b64url(JSON.stringify(body));
  return data + '.' + sign(data);
}

// 校验 token：签名不符或已过期返回 null，否则返回 payload
export function verifyToken(token: string): Record<string, any> | null {
  if (!token) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  if (sign(data) !== sig) return null;
  try {
    const json = Buffer.from(
      data.replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString();
    const payload = JSON.parse(json);
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
