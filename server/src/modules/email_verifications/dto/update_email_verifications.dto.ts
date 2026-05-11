import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmailVerificationsDto {
  @ApiPropertyOptional({
    example: {
      user_id: '11111111-1111-1111-1111-111111111111',
      code: '123456',
      verified_at: null,
      expired_at: '2026-12-31T23:59:59.000Z',
    },
  })
  data?: Record<string, unknown>;
}
