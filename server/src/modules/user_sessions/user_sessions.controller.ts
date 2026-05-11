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
import { UserSessionsService } from './user_sessions.service';
import { CreateUserSessionsDto } from './dto/create_user_sessions.dto';
import { UpdateUserSessionsDto } from './dto/update_user_sessions.dto';
import { QueryUserSessionsDto } from './dto/query_user_sessions.dto';

@ApiTags('user_sessions')
@Controller('user_sessions')
export class UserSessionsController {
  constructor(private readonly service: UserSessionsService) {}

  @Post()
  create(@Body() dto: CreateUserSessionsDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateUserSessionsDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryUserSessionsDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryUserSessionsDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserSessionsDto) {
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
