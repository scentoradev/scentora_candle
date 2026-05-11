import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSessionsDto {
  @ApiProperty({
    example: {
      user_id: '11111111-1111-1111-1111-111111111111',
      refresh_token: 'jwt_refresh_token',
      ip_address: '127.0.0.1',
      user_agent: 'Mozilla/5.0',
      expired_at: '2026-12-31T23:59:59.000Z',
    },
  })
  data!: Record<string, unknown>;
}
