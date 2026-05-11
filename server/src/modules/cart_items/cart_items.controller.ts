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
import { CartItemsService } from './cart_items.service';
import { CreateCartItemsDto } from './dto/create_cart_items.dto';
import { UpdateCartItemsDto } from './dto/update_cart_items.dto';
import { QueryCartItemsDto } from './dto/query_cart_items.dto';

@ApiTags('cart_items')
@Controller('cart_items')
export class CartItemsController {
  constructor(private readonly service: CartItemsService) {}

  @Post()
  create(@Body() dto: CreateCartItemsDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateCartItemsDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryCartItemsDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryCartItemsDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCartItemsDto) {
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
