import { Injectable } from '@nestjs/common';
import { CreateOrdersDto } from './dto/create_orders.dto';
import { UpdateOrdersDto } from './dto/update_orders.dto';
import { QueryOrdersDto } from './dto/query_orders.dto';
import { OrdersRecord } from './interfaces/orders.interface';

@Injectable()
export class OrdersService {
  create(dto: CreateOrdersDto) {
    return {
      message: 'Create orders',
      data: dto,
    };
  }

  bulkCreate(payload: CreateOrdersDto[]) {
    return {
      message: 'Bulk create orders',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryOrdersDto) {
    return {
      message: 'List orders',
      query,
      items: [] as OrdersRecord[],
    };
  }

  search(query: QueryOrdersDto) {
    return {
      message: 'Search orders',
      query,
      items: [] as OrdersRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get orders by id',
      id,
    };
  }

  update(id: string, dto: UpdateOrdersDto) {
    return {
      message: 'Update orders',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore orders',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete orders',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete orders',
      id,
    };
  }
}
