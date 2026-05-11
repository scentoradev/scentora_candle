import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponsDto {
  @ApiProperty({
    example: {
      usage_limit: 100,
      discount_type: 'PERCENT',
      code: 'WELCOME10',
      expired_at: '2026-12-31T23:59:59.000Z',
      min_order_amount: 200000,
      used_count: 0,
      discount_value: 10,
      is_active: true,
    },
  })
  data!: Record<string, unknown>;
}
