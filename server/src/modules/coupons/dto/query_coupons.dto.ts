import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCouponsDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;

  @ApiPropertyOptional({ example: 'lavender' })
  search?: string;
}
