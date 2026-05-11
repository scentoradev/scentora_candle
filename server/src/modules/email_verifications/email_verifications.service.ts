import { Injectable } from '@nestjs/common';
import { CreateEmailVerificationsDto } from './dto/create_email_verifications.dto';
import { UpdateEmailVerificationsDto } from './dto/update_email_verifications.dto';
import { QueryEmailVerificationsDto } from './dto/query_email_verifications.dto';
import { EmailVerificationsRecord } from './interfaces/email_verifications.interface';

@Injectable()
export class EmailVerificationsService {
  create(dto: CreateEmailVerificationsDto) {
    return {
      message: 'Create email_verifications',
      data: dto,
    };
  }

  bulkCreate(payload: CreateEmailVerificationsDto[]) {
    return {
      message: 'Bulk create email_verifications',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryEmailVerificationsDto) {
    return {
      message: 'List email_verifications',
      query,
      items: [] as EmailVerificationsRecord[],
    };
  }

  search(query: QueryEmailVerificationsDto) {
    return {
      message: 'Search email_verifications',
      query,
      items: [] as EmailVerificationsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get email_verifications by id',
      id,
    };
  }

  update(id: string, dto: UpdateEmailVerificationsDto) {
    return {
      message: 'Update email_verifications',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore email_verifications',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete email_verifications',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete email_verifications',
      id,
    };
  }
}
