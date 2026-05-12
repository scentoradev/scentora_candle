import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/pg.provider';
import { assertAdminAuthorization } from '../../utils/admin-auth.util';
import { CreateInventoryLogsDto } from './dto/create_inventory_logs.dto';
import { UpdateInventoryLogsDto } from './dto/update_inventory_logs.dto';
import { QueryInventoryLogsDto } from './dto/query_inventory_logs.dto';
import { InventoryLogsRecord } from './interfaces/inventory_logs.interface';

@Injectable()
export class InventoryLogsService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CreateInventoryLogsDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      product_id?: string;
      type?: 'IN' | 'OUT';
      quantity?: number;
      reason?: string;
    };
    const result = await this.pool.query(
      `INSERT INTO inventory_logs (product_id, type, quantity, reason) VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        payload.product_id,
        payload.type ?? 'IN',
        Number(payload.quantity ?? 0),
        payload.reason ?? null,
      ],
    );
    return { message: 'Create inventory_logs', data: result.rows[0] };
  }

  async findAll(query: QueryInventoryLogsDto, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query<InventoryLogsRecord>(
      `SELECT * FROM inventory_logs ORDER BY created_at DESC`,
    );
    return { message: 'List inventory_logs', query, items: result.rows };
  }

  async findOne(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query<InventoryLogsRecord>(
      `SELECT * FROM inventory_logs WHERE id = $1 LIMIT 1`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Inventory log not found');
    return { message: 'Get inventory_logs by id', data: result.rows[0] };
  }

  async update(
    id: string,
    dto: UpdateInventoryLogsDto,
    authorization?: string,
  ) {
    assertAdminAuthorization(authorization);
    const payload = (dto.data ?? dto) as {
      type?: 'IN' | 'OUT';
      quantity?: number;
      reason?: string;
    };
    const result = await this.pool.query(
      `
      UPDATE inventory_logs
      SET type = COALESCE($2, type), quantity = COALESCE($3, quantity), reason = COALESCE($4, reason)
      WHERE id = $1
      RETURNING *
      `,
      [
        id,
        payload.type ?? null,
        payload.quantity !== undefined ? Number(payload.quantity) : null,
        payload.reason ?? null,
      ],
    );
    if (!result.rows[0]) throw new NotFoundException('Inventory log not found');
    return { message: 'Update inventory_logs', data: result.rows[0] };
  }

  async remove(id: string, authorization?: string) {
    assertAdminAuthorization(authorization);
    const result = await this.pool.query(
      `DELETE FROM inventory_logs WHERE id = $1 RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Inventory log not found');
    return { message: 'Delete inventory_logs', id };
  }
}
