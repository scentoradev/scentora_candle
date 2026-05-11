import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentWebhooksDto {
  @ApiProperty({
    example: {
      payload: {
        orderId: 'MOMO_ORD_001',
        resultCode: 0,
        message: 'Success',
      },
      provider: 'MOMO',
    },
  })
  data!: Record<string, unknown>;
}
