import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoriesDto {
  @ApiPropertyOptional({
    example: {
      description: 'Natural soy wax candle',
      name: 'Soy Candle',
      slug: 'soy-candle',
    },
  })
  data?: Record<string, unknown>;
}
