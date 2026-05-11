import { Injectable } from '@nestjs/common';
import { CreateProductImagesDto } from './dto/create_product_images.dto';
import { UpdateProductImagesDto } from './dto/update_product_images.dto';
import { QueryProductImagesDto } from './dto/query_product_images.dto';
import { ProductImagesRecord } from './interfaces/product_images.interface';

@Injectable()
export class ProductImagesService {
  create(dto: CreateProductImagesDto) {
    return {
      message: 'Create product_images',
      data: dto,
    };
  }

  bulkCreate(payload: CreateProductImagesDto[]) {
    return {
      message: 'Bulk create product_images',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryProductImagesDto) {
    return {
      message: 'List product_images',
      query,
      items: [] as ProductImagesRecord[],
    };
  }

  search(query: QueryProductImagesDto) {
    return {
      message: 'Search product_images',
      query,
      items: [] as ProductImagesRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get product_images by id',
      id,
    };
  }

  update(id: string, dto: UpdateProductImagesDto) {
    return {
      message: 'Update product_images',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore product_images',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete product_images',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete product_images',
      id,
    };
  }
}
