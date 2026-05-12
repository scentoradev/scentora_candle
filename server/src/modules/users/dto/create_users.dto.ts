import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({
    example: {
      full_name: 'Admin',
      password: '123456',
      role: 'admin',
      email: 'admin@example.com',
    },
  })
  data!: Record<string, unknown>;
}
