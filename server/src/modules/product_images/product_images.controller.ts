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
import { ProductImagesService } from './product_images.service';
import { CreateProductImagesDto } from './dto/create_product_images.dto';
import { UpdateProductImagesDto } from './dto/update_product_images.dto';
import { QueryProductImagesDto } from './dto/query_product_images.dto';

@ApiTags('product_images')
@Controller('product_images')
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}

  @Post()
  create(@Body() dto: CreateProductImagesDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateProductImagesDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryProductImagesDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryProductImagesDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductImagesDto) {
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
