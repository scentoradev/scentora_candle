import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateCategoriesDto } from './dto/create_categories.dto';
import { UpdateCategoriesDto } from './dto/update_categories.dto';
import { QueryCategoriesDto } from './dto/query_categories.dto';
import { CategoriesRecord } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  private readonly setupPromise: Promise<void>;

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {
    this.setupPromise = this.setupTable();
  }

  private async setupTable() {
    await this.pool.query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order)
    `);
    await this.pool.query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS is_home_visible BOOLEAN NOT NULL DEFAULT TRUE
    `);
  }

  private async ensureReady() {
    await this.setupPromise;
  }

  private isDuplicateSlugError(error: unknown) {
    const pgError = error as { code?: string; constraint?: string };
    return (
      pgError?.code === '23505' && pgError?.constraint === 'categories_slug_key'
    );
  }

  private isTransientDbError(error: unknown) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    return (
      message.includes('timeout') ||
      message.includes('connection terminated') ||
      message.includes('connection terminated unexpectedly') ||
      message.includes('query read timeout')
    );
  }

  async create(dto: CreateCategoriesDto, authorization?: string) {
    await this.ensureReady();
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      name?: string;
      slug?: string;
      description?: string;
      parent_id?: string | null;
      sort_order?: number;
      is_home_visible?: boolean;
    };
    try {
      const result = await this.pool.query(
        `INSERT INTO categories (name, slug, description, parent_id, sort_order, is_home_visible) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          payload.name,
          payload.slug,
          payload.description ?? null,
          payload.parent_id ?? null,
          Number(payload.sort_order ?? 0),
          typeof payload.is_home_visible === 'boolean'
            ? payload.is_home_visible
            : true,
        ],
      );
      return { message: 'Create categories', data: result.rows[0] };
    } catch (error) {
      if (this.isDuplicateSlugError(error)) {
        throw new ConflictException('Slug danh mục đã tồn tại');
      }
      throw error;
    }
  }

  async findAll(query: QueryCategoriesDto) {
    await this.ensureReady();
    let result;
    const sql = `SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC`;
    try {
      result = await this.pool.query<CategoriesRecord>(sql);
    } catch (error) {
      if (!this.isTransientDbError(error)) throw error;
      result = await this.pool.query<CategoriesRecord>(sql);
    }
    return { message: 'List categories', query, items: result.rows };
  }

  async countAll() {
    await this.ensureReady();
    let totalRes;
    try {
      totalRes = await this.pool.query<{ total: string }>(
        `SELECT COUNT(*)::text AS total FROM categories WHERE deleted_at IS NULL`,
      );
    } catch (error) {
      if (!this.isTransientDbError(error)) throw error;
      totalRes = await this.pool.query<{ total: string }>(
        `SELECT COUNT(*)::text AS total FROM categories WHERE deleted_at IS NULL`,
      );
    }
    return {
      message: 'Count all categories',
      total: Number(totalRes.rows[0]?.total ?? 0),
    };
  }

  async countByParent() {
    await this.ensureReady();
    let rowsRes;
    const sql = `
      SELECT parent_id, COUNT(*)::text AS total
      FROM categories
      WHERE deleted_at IS NULL
      GROUP BY parent_id
      ORDER BY parent_id NULLS FIRST
    `;
    try {
      rowsRes = await this.pool.query<{
        parent_id: string | null;
        total: string;
      }>(sql);
    } catch (error) {
      if (!this.isTransientDbError(error)) throw error;
      rowsRes = await this.pool.query<{
        parent_id: string | null;
        total: string;
      }>(sql);
    }

    return {
      message: 'Count categories by parent',
      items: rowsRes.rows.map((row) => ({
        parent_id: row.parent_id,
        total: Number(row.total),
      })),
    };
  }

  async findOne(id: string) {
    await this.ensureReady();
    const result = await this.pool.query<CategoriesRecord>(
      `SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Category not found');
    return { message: 'Get categories by id', data: result.rows[0] };
  }

  async update(id: string, dto: UpdateCategoriesDto, authorization?: string) {
    await this.ensureReady();
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      name?: string;
      slug?: string;
      description?: string;
      parent_id?: string | null;
      sort_order?: number;
      is_home_visible?: boolean;
    };
    let result;
    try {
      result = await this.pool.query(
        `
        UPDATE categories
        SET
          name = COALESCE($2, name),
          slug = COALESCE($3, slug),
          description = COALESCE($4, description),
          sort_order = COALESCE($6, sort_order),
          is_home_visible = COALESCE($7, is_home_visible),
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
          Object.prototype.hasOwnProperty.call(payload, 'parent_id')
            ? (payload.parent_id ?? '')
            : '__KEEP__',
          payload.sort_order !== undefined ? Number(payload.sort_order) : null,
          typeof payload.is_home_visible === 'boolean'
            ? payload.is_home_visible
            : null,
        ],
      );
    } catch (error) {
      if (this.isDuplicateSlugError(error)) {
        throw new ConflictException('Slug danh mục đã tồn tại');
      }
      throw error;
    }
    if (!result.rows[0]) throw new NotFoundException('Category not found');
    return { message: 'Update categories', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    await this.ensureReady();
    assertAdminAuthorization(authorization);
    let result;
    try {
      result = await this.pool.query(
        `DELETE FROM categories WHERE id = $1 RETURNING id`,
        [id],
      );
    } catch (error) {
      const pgError = error as { code?: string };
      if (pgError?.code === '23503') {
        throw new BadRequestException(
          'Không thể xóa danh mục do còn dữ liệu liên quan',
        );
      }
      throw error;
    }
    if (!result.rows[0]) throw new NotFoundException('Category not found');
    return { message: 'Delete categories', id };
  }
}
