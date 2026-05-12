import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateProductImagesDto } from './dto/create_product_images.dto';
import { UpdateProductImagesDto } from './dto/update_product_images.dto';
import { QueryProductImagesDto } from './dto/query_product_images.dto';
import { ProductImagesRecord } from './interfaces/product_images.interface';

@Injectable()
export class ProductImagesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CreateProductImagesDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      product_id?: string;
      image_url?: string;
      sort_order?: number;
    };
    const result = await this.pool.query(
      `INSERT INTO product_images (product_id, image_url, sort_order) VALUES ($1, $2, $3) RETURNING *`,
      [payload.product_id, payload.image_url, Number(payload.sort_order ?? 0)],
    );
    return { message: 'Create product_images', data: result.rows[0] };
  }

  async findAll(query: QueryProductImagesDto) {
    const result = await this.pool.query<ProductImagesRecord>(
      `SELECT * FROM product_images ORDER BY created_at DESC`,
    );
    return { message: 'List product_images', query, items: result.rows };
  }

  async findOne(id: string) {
    const result = await this.pool.query<ProductImagesRecord>(
      `SELECT * FROM product_images WHERE id = $1 LIMIT 1`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Product image not found');
    return { message: 'Get product_images by id', data: result.rows[0] };
  }

  async update(
    id: string,
    dto: UpdateProductImagesDto,
    authorization?: string,
  ) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      image_url?: string;
      sort_order?: number;
    };
    const result = await this.pool.query(
      `
      UPDATE product_images
      SET image_url = COALESCE($2, image_url), sort_order = COALESCE($3, sort_order)
      WHERE id = $1
      RETURNING *
      `,
      [
        id,
        payload.image_url ?? null,
        payload.sort_order !== undefined ? Number(payload.sort_order) : null,
      ],
    );
    if (!result.rows[0]) throw new NotFoundException('Product image not found');
    return { message: 'Update product_images', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query(
      `DELETE FROM product_images WHERE id = $1 RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Product image not found');
    return { message: 'Delete product_images', id };
  }
}
