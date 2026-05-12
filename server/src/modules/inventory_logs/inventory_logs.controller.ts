import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { resolveAuthorizationForSwagger } from '../../utils/admin-auth.util';
import { InventoryLogsService } from './inventory_logs.service';
import { CreateInventoryLogsDto } from './dto/create_inventory_logs.dto';
import { UpdateInventoryLogsDto } from './dto/update_inventory_logs.dto';
import { QueryInventoryLogsDto } from './dto/query_inventory_logs.dto';

@ApiTags('inventory_logs')
@Controller('inventory_logs')
export class InventoryLogsController {
  constructor(private readonly service: InventoryLogsService) {}

  @Post()
  create(
    @Body() dto: CreateInventoryLogsDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.create(dto, resolveAuthorizationForSwagger(req.headers));
  }

  @Get()
  findAll(
    @Query() query: QueryInventoryLogsDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.findAll(query, resolveAuthorizationForSwagger(req.headers));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.findOne(id, resolveAuthorizationForSwagger(req.headers));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryLogsDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.update(id, dto, resolveAuthorizationForSwagger(req.headers));
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.remove(id, resolveAuthorizationForSwagger(req.headers));
  }
}
