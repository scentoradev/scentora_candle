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
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/create_orders.dto';
import { UpdateOrdersDto } from './dto/update_orders.dto';
import { QueryOrdersDto } from './dto/query_orders.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrdersDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateOrdersDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryOrdersDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryOrdersDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrdersDto) {
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
