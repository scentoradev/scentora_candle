import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateProductsDto } from './dto/create_products.dto';
import { UpdateProductsDto } from './dto/update_products.dto';
import { QueryProductsDto } from './dto/query_products.dto';
import { ProductsRecord } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  private readonly setupPromise: Promise<void>;
  private readonly pool: Pool;

  constructor(@Inject(PG_POOL) pool: Pool) {
    this.pool = pool;
    this.setupPromise = this.setupTable();
  }

  private async setupTable() {
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_active_created_at
      ON products(created_at DESC)
      WHERE deleted_at IS NULL AND is_active = true
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_active_category
      ON products(category_id)
      WHERE deleted_at IS NULL AND is_active = true
    `);
  }

  private async ensureReady() {
    await this.setupPromise;
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

  private isDuplicateSlugError(error: unknown) {
    const pgError = error as { code?: string; constraint?: string };
    return (
      pgError?.code === '23505' && pgError?.constraint === 'products_slug_key'
    );
  }

  async create(dto: CreateProductsDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = dto.data ?? dto;
    let result;
    try {
      result = await this.pool.query(
        `
        INSERT INTO products (
          category_id, name, slug, description, short_description, price, stock, scent,
          burn_time, weight, thumbnail_url, meta_title, meta_description, is_active
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,COALESCE($14,true))
        RETURNING *
        `,
        [
          (payload.category_id as string) ?? null,
          (payload.name as string) ?? null,
          (payload.slug as string) ?? null,
          (payload.description as string) ?? null,
          (payload.short_description as string) ?? null,
          Number(payload.price ?? 0),
          Number(payload.stock ?? 0),
          (payload.scent as string) ?? null,
          payload.burn_time ? Number(payload.burn_time) : null,
          payload.weight ? Number(payload.weight) : null,
          (payload.thumbnail_url as string) ?? null,
          (payload.meta_title as string) ?? null,
          (payload.meta_description as string) ?? null,
          typeof payload.is_active === 'boolean' ? payload.is_active : true,
        ],
      );
    } catch (error) {
      if (this.isDuplicateSlugError(error)) {
        throw new ConflictException('Slug sản phẩm đã tồn tại');
      }
      throw error;
    }
    return { message: 'Create products', data: result.rows[0] };
  }

  async findAll(query: QueryProductsDto, authorization?: string) {
    await this.ensureReady();

    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
    const offset = (page - 1) * limit;
    const search = query.search?.trim();
    const hasSearch = Boolean(search);

    const includeInactive =
      query.include_inactive === true ||
      String(query.include_inactive).toLowerCase() === 'true' ||
      String(query.include_inactive) === '1';
    if (includeInactive) {
      assertAdminAuthorization(authorization);
    }

    const activeFilter = includeInactive
      ? `deleted_at IS NULL`
      : `deleted_at IS NULL AND is_active = true`;
    const whereSql = hasSearch
      ? `${activeFilter} AND (name ILIKE $1 OR scent ILIKE $1 OR slug ILIKE $1)`
      : activeFilter;

    const params = hasSearch ? [`%${search}%`, limit, offset] : [limit, offset];
    const sql = hasSearch
      ? `SELECT * FROM products WHERE ${whereSql} ORDER BY created_at DESC LIMIT $2 OFFSET $3`
      : `SELECT * FROM products WHERE ${whereSql} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

    let result;
    try {
      result = await this.pool.query<ProductsRecord>(sql, params);
    } catch (error) {
      if (!this.isTransientDbError(error)) throw error;
      result = await this.pool.query<ProductsRecord>(sql, params);
    }

    return {
      message: 'List products',
      query: { ...query, page, limit },
      items: result.rows,
    };
  }

  async countAll() {
    await this.ensureReady();
    const totalRes = await this.pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM products WHERE deleted_at IS NULL AND is_active = true`,
    );
    return {
      message: 'Count all products',
      total: Number(totalRes.rows[0]?.total ?? 0),
    };
  }

  async countByCategory() {
    await this.ensureReady();
    const rowsRes = await this.pool.query<{
      category_id: string | null;
      total: string;
    }>(
      `
      SELECT category_id, COUNT(*)::text AS total
      FROM products
      WHERE deleted_at IS NULL AND is_active = true
      GROUP BY category_id
      ORDER BY category_id NULLS FIRST
      `,
    );

    return {
      message: 'Count products by category',
      items: rowsRes.rows.map((row) => ({
        category_id: row.category_id,
        total: Number(row.total),
      })),
    };
  }

  async findOne(id: string) {
    const result = await this.pool.query<ProductsRecord>(
      `SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Product not found');
    return { message: 'Get products by id', data: result.rows[0] };
  }

  async update(id: string, dto: UpdateProductsDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as Record<string, unknown>;
    const result = await this.pool.query(
      `
      UPDATE products
      SET
        category_id = COALESCE($2, category_id),
        name = COALESCE($3, name),
        slug = COALESCE($4, slug),
        description = COALESCE($5, description),
        short_description = COALESCE($6, short_description),
        price = COALESCE($7, price),
        stock = COALESCE($8, stock),
        thumbnail_url = COALESCE($9, thumbnail_url),
        is_active = COALESCE($10, is_active)
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
      `,
      [
        id,
        (payload.category_id as string) ?? null,
        (payload.name as string) ?? null,
        (payload.slug as string) ?? null,
        (payload.description as string) ?? null,
        (payload.short_description as string) ?? null,
        payload.price !== undefined ? Number(payload.price) : null,
        payload.stock !== undefined ? Number(payload.stock) : null,
        (payload.thumbnail_url as string) ?? null,
        typeof payload.is_active === 'boolean' ? payload.is_active : null,
      ],
    );
    if (!result.rows[0]) throw new NotFoundException('Product not found');
    return { message: 'Update products', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query(
      `UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Product not found');
    return { message: 'Soft delete products', id };
  }
}
