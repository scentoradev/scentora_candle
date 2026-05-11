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
import { InventoryLogsService } from './inventory_logs.service';
import { CreateInventoryLogsDto } from './dto/create_inventory_logs.dto';
import { UpdateInventoryLogsDto } from './dto/update_inventory_logs.dto';
import { QueryInventoryLogsDto } from './dto/query_inventory_logs.dto';

@ApiTags('inventory_logs')
@Controller('inventory_logs')
export class InventoryLogsController {
  constructor(private readonly service: InventoryLogsService) {}

  @Post()
  create(@Body() dto: CreateInventoryLogsDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateInventoryLogsDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryInventoryLogsDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryInventoryLogsDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryLogsDto) {
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
