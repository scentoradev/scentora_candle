import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create_users.dto';
import { UpdateUsersDto } from './dto/update_users.dto';
import { QueryUsersDto } from './dto/query_users.dto';
import { UsersRecord } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  create(dto: CreateUsersDto) {
    return {
      message: 'Create users',
      data: dto,
    };
  }

  bulkCreate(payload: CreateUsersDto[]) {
    return {
      message: 'Bulk create users',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryUsersDto) {
    return {
      message: 'List users',
      query,
      items: [] as UsersRecord[],
    };
  }

  search(query: QueryUsersDto) {
    return {
      message: 'Search users',
      query,
      items: [] as UsersRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get users by id',
      id,
    };
  }

  update(id: string, dto: UpdateUsersDto) {
    return {
      message: 'Update users',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore users',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete users',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete users',
      id,
    };
  }
}
