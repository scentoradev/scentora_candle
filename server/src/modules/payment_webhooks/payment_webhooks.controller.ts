import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentWebhooksService } from './payment_webhooks.service';
import { CreatePaymentWebhooksDto } from './dto/create_payment_webhooks.dto';
import { UpdatePaymentWebhooksDto } from './dto/update_payment_webhooks.dto';
import { QueryPaymentWebhooksDto } from './dto/query_payment_webhooks.dto';

@ApiTags('payment_webhooks')
@Controller('payment_webhooks')
export class PaymentWebhooksController {
  constructor(private readonly service: PaymentWebhooksService) {}

  @Post()
  create(@Body() dto: CreatePaymentWebhooksDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreatePaymentWebhooksDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryPaymentWebhooksDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryPaymentWebhooksDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentWebhooksDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Delete(':id/hard')
  hardRemove(@Param('id') id: string) {
    return this.service.hardRemove(id);
  }
}
