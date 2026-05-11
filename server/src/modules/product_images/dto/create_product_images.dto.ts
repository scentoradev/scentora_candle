import { ApiProperty } from '@nestjs/swagger';

export class CreateProductImagesDto {
  @ApiProperty({
    example: {
      product_id: '33333333-3333-3333-3333-333333333333',
      sort_order: 1,
      image_url: '/images/lavender-1.jpg',
    },
  })
  data!: Record<string, unknown>;
}
