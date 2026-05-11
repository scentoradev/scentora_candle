import { Injectable } from '@nestjs/common';
import { CreateUserSessionsDto } from './dto/create_user_sessions.dto';
import { UpdateUserSessionsDto } from './dto/update_user_sessions.dto';
import { QueryUserSessionsDto } from './dto/query_user_sessions.dto';
import { UserSessionsRecord } from './interfaces/user_sessions.interface';

@Injectable()
export class UserSessionsService {
  create(dto: CreateUserSessionsDto) {
    return {
      message: 'Create user_sessions',
      data: dto,
    };
  }

  bulkCreate(payload: CreateUserSessionsDto[]) {
    return {
      message: 'Bulk create user_sessions',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryUserSessionsDto) {
    return {
      message: 'List user_sessions',
      query,
      items: [] as UserSessionsRecord[],
    };
  }

  search(query: QueryUserSessionsDto) {
    return {
      message: 'Search user_sessions',
      query,
      items: [] as UserSessionsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get user_sessions by id',
      id,
    };
  }

  update(id: string, dto: UpdateUserSessionsDto) {
    return {
      message: 'Update user_sessions',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore user_sessions',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete user_sessions',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete user_sessions',
      id,
    };
  }
}
