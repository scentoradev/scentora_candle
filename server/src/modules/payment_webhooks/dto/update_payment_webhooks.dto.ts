import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentWebhooksDto {
  @ApiPropertyOptional({
    example: {
      payload: {
        orderId: 'PAY_ORD_001',
        resultCode: 0,
        message: 'Success',
      },
      provider: 'OTHER',
    },
  })
  data?: Record<string, unknown>;
}
