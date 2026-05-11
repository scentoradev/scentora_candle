import { Injectable } from '@nestjs/common';
import { CreatePaymentsDto } from './dto/create_payments.dto';
import { UpdatePaymentsDto } from './dto/update_payments.dto';
import { QueryPaymentsDto } from './dto/query_payments.dto';
import { PaymentsRecord } from './interfaces/payments.interface';

@Injectable()
export class PaymentsService {
  create(dto: CreatePaymentsDto) {
    return {
      message: 'Create payments',
      data: dto,
    };
  }

  bulkCreate(payload: CreatePaymentsDto[]) {
    return {
      message: 'Bulk create payments',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryPaymentsDto) {
    return {
      message: 'List payments',
      query,
      items: [] as PaymentsRecord[],
    };
  }

  search(query: QueryPaymentsDto) {
    return {
      message: 'Search payments',
      query,
      items: [] as PaymentsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get payments by id',
      id,
    };
  }

  update(id: string, dto: UpdatePaymentsDto) {
    return {
      message: 'Update payments',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore payments',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete payments',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete payments',
      id,
    };
  }
}
