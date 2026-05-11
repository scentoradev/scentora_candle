import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemsDto {
  @ApiProperty({
    example: {
      user_id: '11111111-1111-1111-1111-111111111111',
      quantity: 2,
      session_id: 'sess_abc123',
      product_id: '33333333-3333-3333-3333-333333333333',
    },
  })
  data!: Record<string, unknown>;
}
