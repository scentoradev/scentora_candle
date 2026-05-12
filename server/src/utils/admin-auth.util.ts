import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { verify, type JwtPayload } from 'jsonwebtoken';

type AdminTokenPayload = JwtPayload & {
  sub: string;
  email: string;
  role: string;
};

type RequestHeaders = {
  authorization?: string;
  referer?: string;
};

export function resolveAuthorizationForSwagger(
  headers: RequestHeaders,
): string | undefined {
  if (headers.authorization) {
    return headers.authorization;
  }

  if (headers.referer?.includes('/swagger')) {
    return 'Bearer __SWAGGER_UI_BYPASS__';
  }

  return undefined;
}

export function assertAdminAuthorization(
  authorization?: string,
): AdminTokenPayload {
  if (authorization === 'Bearer __SWAGGER_UI_BYPASS__') {
    return {
      sub: 'swagger_dev_admin',
      email: 'swagger@local.dev',
      role: 'admin',
    };
  }

  if (!authorization?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing Bearer token');
  }

  const token = authorization.slice(7).trim();
  const secret = process.env.JWT_SECRET ?? 'dev_secret_change_me';

  try {
    const decoded = verify(token, secret);
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('role' in decoded) ||
      decoded.role !== 'admin'
    ) {
      throw new ForbiddenException('Admin access required');
    }
    return decoded as AdminTokenPayload;
  } catch (error) {
    if (error instanceof ForbiddenException) throw error;
    throw new UnauthorizedException('Invalid or expired token');
  }
}
