import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrdersDto {
  @ApiPropertyOptional({
    example: {
      total_amount: 520000,
      order_code: 'ORD-20260511-0001',
      subtotal: 500000,
      shipping_fee: 30000,
      paid_at: null,
      payment_status: 'UNPAID',
      address_id: '44444444-4444-4444-4444-444444444444',
      status: 'PENDING_PAYMENT',
      admin_note: '',
      shipped_at: null,
      user_id: '11111111-1111-1111-1111-111111111111',
      discount_amount: 10000,
      note: 'Office hours delivery',
      completed_at: null,
    },
  })
  data?: Record<string, unknown>;
}
