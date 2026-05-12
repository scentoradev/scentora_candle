import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import { compare } from 'bcryptjs';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { PG_POOL } from '../../database/pg.provider';
import { LoginDto } from './dto/login.dto';
type TokenPayload = JwtPayload & { sub: string; email: string; role: string };

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  full_name: string | null;
  role: string;
};

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const userRes = await this.pool.query<UserRow>(
      `
      SELECT id, email, password_hash, full_name, role
      FROM users
      WHERE email = $1 AND role = 'admin' AND deleted_at IS NULL
      LIMIT 1
      `,
      [dto.email],
    );

    const user = userRes.rows[0];
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createSessionAndToken(user);
  }

  async me(authorization?: string): Promise<AuthResponse['user']> {
    const payload = this.verifyAndGetPayload(authorization);

    const result = await this.pool.query<UserRow>(
      `
      SELECT id, email, password_hash, full_name, role
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1
      `,
      [payload.sub],
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };
  }

  async logout(authorization?: string): Promise<{ message: string }> {
    this.verifyAndGetPayload(authorization);
    return { message: 'Logged out successfully' };
  }

  private createSessionAndToken(user: UserRow): AuthResponse {
    const secret = process.env.JWT_SECRET ?? 'dev_secret_change_me';
    const accessToken = sign({ email: user.email, role: user.role }, secret, {
      subject: user.id,
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  private verifyAndGetPayload(authorization?: string): TokenPayload {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = authorization.slice(7).trim();
    const secret = process.env.JWT_SECRET ?? 'dev_secret_change_me';

    try {
      const decoded = verify(token, secret);
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'sub' in decoded &&
        'email' in decoded &&
        'role' in decoded
      ) {
        return decoded as TokenPayload;
      }
      throw new UnauthorizedException('Invalid token payload');
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
