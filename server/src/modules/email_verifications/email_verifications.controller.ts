import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailVerificationsService } from './email_verifications.service';
import { CreateEmailVerificationsDto } from './dto/create_email_verifications.dto';
import { UpdateEmailVerificationsDto } from './dto/update_email_verifications.dto';
import { QueryEmailVerificationsDto } from './dto/query_email_verifications.dto';

@ApiTags('email_verifications')
@Controller('email_verifications')
export class EmailVerificationsController {
  constructor(private readonly service: EmailVerificationsService) {}

  @Post()
  create(@Body() dto: CreateEmailVerificationsDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateEmailVerificationsDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryEmailVerificationsDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryEmailVerificationsDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmailVerificationsDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Delete(':id/hard')
  hardRemove(@Param('id') id: string) {
    return this.service.hardRemove(id);
  }
}
