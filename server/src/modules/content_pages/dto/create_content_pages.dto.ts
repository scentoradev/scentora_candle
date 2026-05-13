import { ApiProperty } from '@nestjs/swagger';

export class CreateContentPagesDto {
  @ApiProperty({
    example: {
      type: 'policy',
      title: 'Bảo mật',
      slug: 'bao_mat',
      summary: 'Cam kết bảo mật thông tin',
      content: '<p>Nội dung chính sách...</p>',
      thumbnail_url: null,
      is_published: true,
      sort_order: 1,
    },
  })
  data!: Record<string, unknown>;
}
