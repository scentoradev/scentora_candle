import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContentPagesDto {
  @ApiPropertyOptional({
    example: {
      title: 'Bảo mật thông tin',
      content: '<p>Cập nhật...</p>',
      is_published: true,
      sort_order: 2,
    },
  })
  data?: Record<string, unknown>;
}
