import { Injectable } from '@nestjs/common';
import { CreateProductsDto } from './dto/create_products.dto';
import { UpdateProductsDto } from './dto/update_products.dto';
import { QueryProductsDto } from './dto/query_products.dto';
import { ProductsRecord } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  create(dto: CreateProductsDto) {
    return {
      message: 'Create products',
      data: dto,
    };
  }

  bulkCreate(payload: CreateProductsDto[]) {
    return {
      message: 'Bulk create products',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryProductsDto) {
    return {
      message: 'List products',
      query,
      items: [] as ProductsRecord[],
    };
  }

  search(query: QueryProductsDto) {
    return {
      message: 'Search products',
      query,
      items: [] as ProductsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get products by id',
      id,
    };
  }

  update(id: string, dto: UpdateProductsDto) {
    return {
      message: 'Update products',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore products',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete products',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete products',
      id,
    };
  }
}
