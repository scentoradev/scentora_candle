import { Injectable } from '@nestjs/common';
import { CreateCategoriesDto } from './dto/create_categories.dto';
import { UpdateCategoriesDto } from './dto/update_categories.dto';
import { QueryCategoriesDto } from './dto/query_categories.dto';
import { CategoriesRecord } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  create(dto: CreateCategoriesDto) {
    return {
      message: 'Create categories',
      data: dto,
    };
  }

  bulkCreate(payload: CreateCategoriesDto[]) {
    return {
      message: 'Bulk create categories',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryCategoriesDto) {
    return {
      message: 'List categories',
      query,
      items: [] as CategoriesRecord[],
    };
  }

  search(query: QueryCategoriesDto) {
    return {
      message: 'Search categories',
      query,
      items: [] as CategoriesRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get categories by id',
      id,
    };
  }

  update(id: string, dto: UpdateCategoriesDto) {
    return {
      message: 'Update categories',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore categories',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete categories',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete categories',
      id,
    };
  }
}
