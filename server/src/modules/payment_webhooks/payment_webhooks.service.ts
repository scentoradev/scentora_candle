import { Injectable } from '@nestjs/common';
import { CreatePaymentWebhooksDto } from './dto/create_payment_webhooks.dto';
import { UpdatePaymentWebhooksDto } from './dto/update_payment_webhooks.dto';
import { QueryPaymentWebhooksDto } from './dto/query_payment_webhooks.dto';
import { PaymentWebhooksRecord } from './interfaces/payment_webhooks.interface';

@Injectable()
export class PaymentWebhooksService {
  create(dto: CreatePaymentWebhooksDto) {
    return {
      message: 'Create payment_webhooks',
      data: dto,
    };
  }

  bulkCreate(payload: CreatePaymentWebhooksDto[]) {
    return {
      message: 'Bulk create payment_webhooks',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryPaymentWebhooksDto) {
    return {
      message: 'List payment_webhooks',
      query,
      items: [] as PaymentWebhooksRecord[],
    };
  }

  search(query: QueryPaymentWebhooksDto) {
    return {
      message: 'Search payment_webhooks',
      query,
      items: [] as PaymentWebhooksRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get payment_webhooks by id',
      id,
    };
  }

  update(id: string, dto: UpdatePaymentWebhooksDto) {
    return {
      message: 'Update payment_webhooks',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore payment_webhooks',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete payment_webhooks',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete payment_webhooks',
      id,
    };
  }
}
