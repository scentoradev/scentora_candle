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
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create_products.dto';
import { UpdateProductsDto } from './dto/update_products.dto';
import { QueryProductsDto } from './dto/query_products.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  create(
    @Body() dto: CreateProductsDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.create(dto, resolveAuthorizationForSwagger(req.headers));
  }

  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.service.findAll(query);
  }

  @Get('count/all')
  countAll() {
    return this.service.countAll();
  }

  @Get('count/by-category')
  countByCategory() {
    return this.service.countByCategory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductsDto,
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
