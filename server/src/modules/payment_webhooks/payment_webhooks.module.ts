import { Module } from '@nestjs/common';
import { PaymentWebhooksController } from './payment_webhooks.controller';
import { PaymentWebhooksService } from './payment_webhooks.service';

@Module({
  controllers: [PaymentWebhooksController],
  providers: [PaymentWebhooksService],
  exports: [PaymentWebhooksService],
})
export class PaymentWebhooksModule {}
