import { Injectable } from '@nestjs/common';
import { CreateOrderItemsDto } from './dto/create_order_items.dto';
import { UpdateOrderItemsDto } from './dto/update_order_items.dto';
import { QueryOrderItemsDto } from './dto/query_order_items.dto';
import { OrderItemsRecord } from './interfaces/order_items.interface';

@Injectable()
export class OrderItemsService {
  create(dto: CreateOrderItemsDto) {
    return {
      message: 'Create order_items',
      data: dto,
    };
  }

  bulkCreate(payload: CreateOrderItemsDto[]) {
    return {
      message: 'Bulk create order_items',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryOrderItemsDto) {
    return {
      message: 'List order_items',
      query,
      items: [] as OrderItemsRecord[],
    };
  }

  search(query: QueryOrderItemsDto) {
    return {
      message: 'Search order_items',
      query,
      items: [] as OrderItemsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get order_items by id',
      id,
    };
  }

  update(id: string, dto: UpdateOrderItemsDto) {
    return {
      message: 'Update order_items',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore order_items',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete order_items',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete order_items',
      id,
    };
  }
}
