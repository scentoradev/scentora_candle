import { Injectable } from '@nestjs/common';
import { CreateCartItemsDto } from './dto/create_cart_items.dto';
import { UpdateCartItemsDto } from './dto/update_cart_items.dto';
import { QueryCartItemsDto } from './dto/query_cart_items.dto';
import { CartItemsRecord } from './interfaces/cart_items.interface';

@Injectable()
export class CartItemsService {
  create(dto: CreateCartItemsDto) {
    return {
      message: 'Create cart_items',
      data: dto,
    };
  }

  bulkCreate(payload: CreateCartItemsDto[]) {
    return {
      message: 'Bulk create cart_items',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryCartItemsDto) {
    return {
      message: 'List cart_items',
      query,
      items: [] as CartItemsRecord[],
    };
  }

  search(query: QueryCartItemsDto) {
    return {
      message: 'Search cart_items',
      query,
      items: [] as CartItemsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get cart_items by id',
      id,
    };
  }

  update(id: string, dto: UpdateCartItemsDto) {
    return {
      message: 'Update cart_items',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore cart_items',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete cart_items',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete cart_items',
      id,
    };
  }
}
