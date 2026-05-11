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
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create_categories.dto';
import { UpdateCategoriesDto } from './dto/update_categories.dto';
import { QueryCategoriesDto } from './dto/query_categories.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoriesDto) {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateCategoriesDto[]) {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryCategoriesDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryCategoriesDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriesDto) {
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
