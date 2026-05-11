import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryLogsDto {
  @ApiProperty({
    example: {
      quantity: 50,
      product_id: '33333333-3333-3333-3333-333333333333',
      reason: 'Initial stock',
      type: 'IN',
    },
  })
  data!: Record<string, unknown>;
}
