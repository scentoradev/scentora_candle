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
import { ContentPagesService } from './content_pages.service';
import { CreateContentPagesDto } from './dto/create_content_pages.dto';
import { QueryContentPagesDto } from './dto/query_content_pages.dto';
import { UpdateContentPagesDto } from './dto/update_content_pages.dto';

@ApiTags('content_pages')
@Controller('content_pages')
export class ContentPagesController {
  constructor(private readonly service: ContentPagesService) {}

  @Post()
  create(
    @Body() dto: CreateContentPagesDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.create(
      dto,
      resolveAuthorizationForSwagger(req.headers),
    );
  }

  @Get()
  findAll(@Query() query: QueryContentPagesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContentPagesDto,
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
