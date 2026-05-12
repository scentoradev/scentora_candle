import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateCategoriesDto } from './dto/create_categories.dto';
import { UpdateCategoriesDto } from './dto/update_categories.dto';
import { QueryCategoriesDto } from './dto/query_categories.dto';
import { CategoriesRecord } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CreateCategoriesDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      name?: string;
      slug?: string;
      description?: string;
      parent_id?: string | null;
    };
    const result = await this.pool.query(
      `INSERT INTO categories (name, slug, description, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [payload.name, payload.slug, payload.description ?? null, payload.parent_id ?? null],
    );
    return { message: 'Create categories', data: result.rows[0] };
  }

  async findAll(query: QueryCategoriesDto) {
    const result = await this.pool.query<CategoriesRecord>(
      `SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    );
    return { message: 'List categories', query, items: result.rows };
  }

  async countAll() {
    const totalRes = await this.pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM categories WHERE deleted_at IS NULL`,
    );
    return {
      message: 'Count all categories',
      total: Number(totalRes.rows[0]?.total ?? 0),
    };
  }

  async countByParent() {
    const rowsRes = await this.pool.query<{ parent_id: string | null; total: string }>(
      `
      SELECT parent_id, COUNT(*)::text AS total
      FROM categories
      WHERE deleted_at IS NULL
      GROUP BY parent_id
      ORDER BY parent_id NULLS FIRST
      `,
    );

    return {
      message: 'Count categories by parent',
      items: rowsRes.rows.map((row) => ({
        parent_id: row.parent_id,
        total: Number(row.total),
      })),
    };
  }

  async findOne(id: string) {
    const result = await this.pool.query<CategoriesRecord>(
      `SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Category not found');
    return { message: 'Get categories by id', data: result.rows[0] };
  }

  async update(id: string, dto: UpdateCategoriesDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      name?: string;
      slug?: string;
      description?: string;
      parent_id?: string | null;
    };
    const result = await this.pool.query(
      `
      UPDATE categories
      SET
        name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        description = COALESCE($4, description),
        parent_id = CASE
          WHEN $5::text = '__KEEP__' THEN parent_id
          ELSE NULLIF($5::text, '')::uuid
        END
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
      `,
      [
        id,
        payload.name ?? null,
        payload.slug ?? null,
        payload.description ?? null,
        Object.prototype.hasOwnProperty.call(payload, 'parent_id') ? (payload.parent_id ?? '') : '__KEEP__',
      ],
    );
    if (!result.rows[0]) throw new NotFoundException('Category not found');
    return { message: 'Update categories', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query(
      `UPDATE categories SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Category not found');
    return { message: 'Soft delete categories', id };
  }
}
