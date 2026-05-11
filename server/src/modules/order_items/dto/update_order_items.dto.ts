import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemsDto {
  @ApiPropertyOptional({
    example: {
      unit_price: 250000,
      quantity: 2,
      total_price: 500000,
      product_image: '/images/lavender.jpg',
      product_name: 'Lavender Soy Candle',
      order_id: '55555555-5555-5555-5555-555555555555',
      product_id: '33333333-3333-3333-3333-333333333333',
    },
  })
  data?: Record<string, unknown>;
}
