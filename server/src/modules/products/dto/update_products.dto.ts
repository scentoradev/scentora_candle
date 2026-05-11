import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductsDto {
  @ApiPropertyOptional({
    example: {
      scent: 'Lavender',
      stock: 20,
      meta_title: 'Lavender Candle',
      meta_description: 'Best lavender candle',
      short_description: 'Lavender scent',
      name: 'Lavender Soy Candle',
      is_active: true,
      price: 250000,
      description: 'Relaxing scented candle',
      thumbnail_url: '/images/lavender.jpg',
      slug: 'lavender-soy-candle',
      weight: 200,
      category_id: '22222222-2222-2222-2222-222222222222',
      burn_time: 40,
    },
  })
  data?: Record<string, unknown>;
}
