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
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create_categories.dto';
import { UpdateCategoriesDto } from './dto/update_categories.dto';
import { QueryCategoriesDto } from './dto/query_categories.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(
    @Body() dto: CreateCategoriesDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.create(
      dto,
      resolveAuthorizationForSwagger(req.headers),
    );
  }

  @Get()
  findAll(@Query() query: QueryCategoriesDto) {
    return this.service.findAll(query);
  }

  @Get('count/all')
  countAll() {
    return this.service.countAll();
  }

  @Get('count/by-parent')
  countByParent() {
    return this.service.countByParent();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoriesDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.update(
      id,
      dto,
      resolveAuthorizationForSwagger(req.headers),
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.remove(id, resolveAuthorizationForSwagger(req.headers));
  }
}
