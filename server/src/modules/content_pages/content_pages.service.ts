import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateContentPagesDto } from './dto/create_content_pages.dto';
import { QueryContentPagesDto } from './dto/query_content_pages.dto';
import { UpdateContentPagesDto } from './dto/update_content_pages.dto';
import { ContentPageRecord, ContentType } from './interfaces/content_pages.interface';

@Injectable()
export class ContentPagesService {
  private readonly setupPromise: Promise<void>;

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {
    this.setupPromise = this.setupTable();
  }

  private async setupTable() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS content_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(32) NOT NULL CHECK (type IN ('policy', 'blog', 'hero')),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        summary TEXT,
        content TEXT,
        thumbnail_url TEXT,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await this.pool.query(`CREATE INDEX IF NOT EXISTS idx_content_pages_type ON content_pages(type)`);
    await this.pool.query(`CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON content_pages(slug)`);
    await this.pool.query(`
      ALTER TABLE content_pages DROP CONSTRAINT IF EXISTS content_pages_type_check
    `);
    await this.pool.query(`
      ALTER TABLE content_pages
      ADD CONSTRAINT content_pages_type_check CHECK (type IN ('policy', 'blog', 'hero'))
    `);
  }

  private async ensureReady() {
    await this.setupPromise;
  }

  async create(dto: CreateContentPagesDto, authorization?: string) {
    await this.ensureReady();
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      type?: ContentType;
      title?: string;
      slug?: string;
      summary?: string;
      content?: string;
      thumbnail_url?: string | null;
      is_published?: boolean;
      sort_order?: number;
    };

    const result = await this.pool.query<ContentPageRecord>(
      `
      INSERT INTO content_pages (type, title, slug, summary, content, thumbnail_url, is_published, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        payload.type ?? 'policy',
        payload.title ?? '',
        payload.slug ?? '',
        payload.summary ?? null,
        payload.content ?? null,
        payload.thumbnail_url ?? null,
        payload.is_published ?? true,
        Number(payload.sort_order ?? 0),
      ],
    );

    return { message: 'Create content_pages', data: result.rows[0] };
  }

  async findAll(query: QueryContentPagesDto) {
    await this.ensureReady();
    const where: string[] = [];
    const values: unknown[] = [];

    if (query.type) {
      values.push(query.type);
      where.push(`type = $${values.length}`);
    }

    if (query.slug) {
      values.push(query.slug);
      where.push(`slug = $${values.length}`);
    }

    if (query.is_published !== undefined) {
      values.push(Boolean(query.is_published));
      where.push(`is_published = $${values.length}`);
    }

    const sql = `
      SELECT *
      FROM content_pages
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY sort_order ASC, created_at DESC
    `;

    const result = await this.pool.query<ContentPageRecord>(sql, values);
    return { message: 'List content_pages', query, items: result.rows };
  }

  async findOne(id: string) {
    await this.ensureReady();
    const result = await this.pool.query<ContentPageRecord>(
      `SELECT * FROM content_pages WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Content page not found');
    }

    return { message: 'Get content_pages by id', data: result.rows[0] };
  }

  async update(id: string, dto: UpdateContentPagesDto, authorization?: string) {
    await this.ensureReady();
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      type?: ContentType;
      title?: string;
      slug?: string;
      summary?: string;
      content?: string;
      thumbnail_url?: string | null;
      is_published?: boolean;
      sort_order?: number;
    };

    const result = await this.pool.query<ContentPageRecord>(
      `
      UPDATE content_pages
      SET
        type = COALESCE($2, type),
        title = COALESCE($3, title),
        slug = COALESCE($4, slug),
        summary = COALESCE($5, summary),
        content = COALESCE($6, content),
        thumbnail_url = COALESCE($7, thumbnail_url),
        is_published = COALESCE($8, is_published),
        sort_order = COALESCE($9, sort_order),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [
        id,
        payload.type ?? null,
        payload.title ?? null,
        payload.slug ?? null,
        payload.summary ?? null,
        payload.content ?? null,
        payload.thumbnail_url ?? null,
        payload.is_published ?? null,
        payload.sort_order !== undefined ? Number(payload.sort_order) : null,
      ],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Content page not found');
    }

    return { message: 'Update content_pages', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    await this.ensureReady();
    assertAdminAuthorization(authorization);
    const result = await this.pool.query(
      `DELETE FROM content_pages WHERE id = $1 RETURNING id`,
      [id],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Content page not found');
    }

    return { message: 'Delete content_pages', id };
  }
}
