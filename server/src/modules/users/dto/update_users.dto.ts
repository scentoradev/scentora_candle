import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsersDto {
  @ApiPropertyOptional({
    example: {
      email_verified: true,
      full_name: 'Nguyen Van A',
      password_hash: 'hash_value',
      avatar_url: 'https://cdn.example.com/avatar.jpg',
      google_id: 'google_123',
      phone: '0901234567',
      role: 'user',
      email: 'user@example.com',
    },
  })
  data?: Record<string, unknown>;
}
