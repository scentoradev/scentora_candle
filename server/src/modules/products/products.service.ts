import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateProductsDto } from './dto/create_products.dto';
import { UpdateProductsDto } from './dto/update_products.dto';
import { QueryProductsDto } from './dto/query_products.dto';
import { ProductsRecord } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CreateProductsDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = dto.data ?? dto;
    const result = await this.pool.query(
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
    return { message: 'Create products', data: result.rows[0] };
  }

  async findAll(query: QueryProductsDto) {
    const result = await this.pool.query<ProductsRecord>(
      `SELECT * FROM products WHERE deleted_at IS NULL AND is_active = true ORDER BY created_at DESC`,
    );
    return { message: 'List products', query, items: result.rows };
  }

  async countAll() {
    const totalRes = await this.pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM products WHERE deleted_at IS NULL AND is_active = true`,
    );
    return {
      message: 'Count all products',
      total: Number(totalRes.rows[0]?.total ?? 0),
    };
  }

  async countByCategory() {
    const rowsRes = await this.pool.query<{ category_id: string | null; total: string }>(
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
