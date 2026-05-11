import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentsDto {
  @ApiProperty({
    example: {
      provider_order_id: 'PAY_ORD_001',
      order_id: '55555555-5555-5555-5555-555555555555',
      raw_response: {
        message: 'Pending',
        resultCode: 0,
      },
      provider: 'OTHER',
      amount: 520000,
      status: 'PENDING',
      transaction_id: 'TXN123456',
      paid_at: null,
    },
  })
  data!: Record<string, unknown>;
}
