import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { hash } from 'bcryptjs';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateUsersDto } from './dto/create_users.dto';
import { UpdateUsersDto } from './dto/update_users.dto';
import { QueryUsersDto } from './dto/query_users.dto';
import { UsersRecord } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CreateUsersDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      email?: string;
      password?: string;
      password_hash?: string;
      full_name?: string;
    };
    const rawPassword = payload.password ?? payload.password_hash ?? '123456';
    const passwordHash = await hash(rawPassword, 10);
    const result = await this.pool.query(
      `INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, 'admin') RETURNING id, email, full_name, role, created_at, updated_at`,
      [payload.email, passwordHash, payload.full_name ?? null],
    );
    return { message: 'Create users', data: result.rows[0] };
  }

  async findAll(query: QueryUsersDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query<UsersRecord>(
      `SELECT id, email, full_name, role, created_at, updated_at, deleted_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    );
    return { message: 'List users', query, items: result.rows };
  }

  async findOne(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query<UsersRecord>(
      `SELECT id, email, full_name, role, created_at, updated_at, deleted_at FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('User not found');
    return { message: 'Get users by id', data: result.rows[0] };
  }

  async update(id: string, dto: UpdateUsersDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      full_name?: string;
      password?: string;
    };
    const passwordHash = payload.password
      ? await hash(payload.password, 10)
      : null;
    const result = await this.pool.query(
      `
      UPDATE users
      SET full_name = COALESCE($2, full_name), password_hash = COALESCE($3, password_hash)
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, email, full_name, role, created_at, updated_at
      `,
      [id, payload.full_name ?? null, passwordHash],
    );
    if (!result.rows[0]) throw new NotFoundException('User not found');
    return { message: 'Update users', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query(
      `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('User not found');
    return { message: 'Soft delete users', id };
  }
}
