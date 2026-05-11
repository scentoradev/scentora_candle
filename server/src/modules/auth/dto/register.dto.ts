import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'P@ssw0rd123' })
  password!: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  full_name!: string;
}
