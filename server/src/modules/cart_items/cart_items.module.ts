import { Module } from '@nestjs/common';
import { CartItemsController } from './cart_items.controller';
import { CartItemsService } from './cart_items.service';

@Module({
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
