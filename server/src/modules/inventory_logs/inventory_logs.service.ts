import { Injectable } from '@nestjs/common';
import { CreateInventoryLogsDto } from './dto/create_inventory_logs.dto';
import { UpdateInventoryLogsDto } from './dto/update_inventory_logs.dto';
import { QueryInventoryLogsDto } from './dto/query_inventory_logs.dto';
import { InventoryLogsRecord } from './interfaces/inventory_logs.interface';

@Injectable()
export class InventoryLogsService {
  create(dto: CreateInventoryLogsDto) {
    return {
      message: 'Create inventory_logs',
      data: dto,
    };
  }

  bulkCreate(payload: CreateInventoryLogsDto[]) {
    return {
      message: 'Bulk create inventory_logs',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryInventoryLogsDto) {
    return {
      message: 'List inventory_logs',
      query,
      items: [] as InventoryLogsRecord[],
    };
  }

  search(query: QueryInventoryLogsDto) {
    return {
      message: 'Search inventory_logs',
      query,
      items: [] as InventoryLogsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get inventory_logs by id',
      id,
    };
  }

  update(id: string, dto: UpdateInventoryLogsDto) {
    return {
      message: 'Update inventory_logs',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore inventory_logs',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete inventory_logs',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete inventory_logs',
      id,
    };
  }
}
