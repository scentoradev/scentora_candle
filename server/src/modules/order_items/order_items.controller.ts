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
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemsDto } from './dto/create_order_items.dto';
import { UpdateOrderItemsDto } from './dto/update_order_items.dto';
import { QueryOrderItemsDto } from './dto/query_order_items.dto';

@ApiTags('order_items')
@Controller('order_items')
export class OrderItemsController {
  constructor(private readonly service: OrderItemsService) {}

  @Post()
  create(@Body() dto: CreateOrderItemsDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateOrderItemsDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryOrderItemsDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryOrderItemsDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderItemsDto) {
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
