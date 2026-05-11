import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewsDto {
  @ApiProperty({
    example: {
      comment: 'Great scent',
      user_id: '11111111-1111-1111-1111-111111111111',
      rating: 5,
      product_id: '33333333-3333-3333-3333-333333333333',
    },
  })
  data!: Record<string, unknown>;
}
