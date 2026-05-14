import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryContentPagesDto {
  @ApiPropertyOptional({ example: 'policy' })
  type?: 'policy' | 'blog' | 'hero';

  @ApiPropertyOptional({ example: 'bao_mat' })
  slug?: string;

  @ApiPropertyOptional({ example: true })
  is_published?: boolean;
}

