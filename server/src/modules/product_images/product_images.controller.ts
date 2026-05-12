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
import { ProductImagesService } from './product_images.service';
import { CreateProductImagesDto } from './dto/create_product_images.dto';
import { UpdateProductImagesDto } from './dto/update_product_images.dto';
import { QueryProductImagesDto } from './dto/query_product_images.dto';

@ApiTags('product_images')
@Controller('product_images')
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}

  @Post()
  create(
    @Body() dto: CreateProductImagesDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.create(dto, resolveAuthorizationForSwagger(req.headers));
  }

  @Get()
  findAll(@Query() query: QueryProductImagesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductImagesDto,
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
