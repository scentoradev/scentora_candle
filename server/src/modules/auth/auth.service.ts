import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { compare, hash } from 'bcryptjs';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { PG_POOL } from '../../database/pg.provider';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type TokenPayload = JwtPayload & { sub: string; sid: string; email: string };

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

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.pool.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
      [dto.email],
    );

    if (existing.rowCount && existing.rowCount > 0) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await hash(dto.password, 10);
    const inserted = await this.pool.query<UserRow>(
      `
      INSERT INTO users (email, password_hash, full_name, email_verified)
      VALUES ($1, $2, $3, false)
      RETURNING id, email, password_hash, full_name, role
      `,
      [dto.email, passwordHash, dto.full_name],
    );

    const user = inserted.rows[0];
    if (!user) {
      throw new BadRequestException('Unable to create user');
    }

    return this.createSessionAndToken(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const userRes = await this.pool.query<UserRow>(
      `
      SELECT id, email, password_hash, full_name, role
      FROM users
      WHERE email = $1 AND deleted_at IS NULL
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
    const payload = this.verifyAndGetPayload(authorization);
    await this.pool.query('DELETE FROM user_sessions WHERE id = $1', [
      payload.sid,
    ]);
    return { message: 'Logged out successfully' };
  }

  private async createSessionAndToken(user: UserRow): Promise<AuthResponse> {
    const sessionRes = await this.pool.query<{ id: string }>(
      `
      INSERT INTO user_sessions (user_id, refresh_token, expired_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
      RETURNING id
      `,
      [user.id, 'pending'],
    );

    const sessionId = sessionRes.rows[0]?.id;
    if (!sessionId) {
      throw new BadRequestException('Unable to create session');
    }

    const secret = process.env.JWT_SECRET ?? 'dev_secret_change_me';
    const accessToken = sign({ email: user.email, sid: sessionId }, secret, {
      subject: user.id,
      expiresIn: '7d',
    });

    await this.pool.query(
      'UPDATE user_sessions SET refresh_token = $1 WHERE id = $2',
      [accessToken, sessionId],
    );

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
        'sid' in decoded &&
        'email' in decoded
      ) {
        return decoded as TokenPayload;
      }
      throw new UnauthorizedException('Invalid token payload');
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
