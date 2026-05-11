import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentWebhooksDto {
  @ApiProperty({
    example: {
      payload: {
        orderId: 'PAY_ORD_001',
        resultCode: 0,
        message: 'Success',
      },
      provider: 'OTHER',
    },
  })
  data!: Record<string, unknown>;
}
