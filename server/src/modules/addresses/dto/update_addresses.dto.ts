import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAddressesDto {
  @ApiPropertyOptional({
    example: {
      address_line: '123 Le Loi',
      is_default: true,
      district: 'District 1',
      receiver_name: 'Nguyen Van A',
      province: 'Ho Chi Minh',
      phone: '0901234567',
      user_id: '11111111-1111-1111-1111-111111111111',
      ward: 'Ben Nghe',
    },
  })
  data?: Record<string, unknown>;
}
