import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPaymentWebhooksDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;

  @ApiPropertyOptional({ example: 'lavender' })
  search?: string;
}
