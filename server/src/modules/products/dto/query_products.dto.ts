import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductsDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;

  @ApiPropertyOptional({ example: 'lavender' })
  search?: string;

  @ApiPropertyOptional({ example: false })
  include_inactive?: boolean;
}
