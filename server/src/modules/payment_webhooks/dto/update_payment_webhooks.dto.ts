import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentWebhooksDto {
  @ApiPropertyOptional({
    example: {
      payload: {
        orderId: 'MOMO_ORD_001',
        resultCode: 0,
        message: 'Success',
      },
      provider: 'MOMO',
    },
  })
  data?: Record<string, unknown>;
}
