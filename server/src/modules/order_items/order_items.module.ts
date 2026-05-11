import { Module } from '@nestjs/common';
import { OrderItemsController } from './order_items.controller';
import { OrderItemsService } from './order_items.service';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
