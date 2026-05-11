import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriesDto {
  @ApiProperty({
    example: {
      description: 'Natural soy wax candle',
      name: 'Soy Candle',
      slug: 'soy-candle',
    },
  })
  data!: Record<string, unknown>;
}
