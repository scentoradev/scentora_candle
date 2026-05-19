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
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create_users.dto';
import { UpdateUsersDto } from './dto/update_users.dto';
import { QueryUsersDto } from './dto/query_users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(
    @Body() dto: CreateUsersDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.create(
      dto,
      resolveAuthorizationForSwagger(req.headers),
    );
  }

  @Get()
  findAll(
    @Query() query: QueryUsersDto,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.findAll(
      query,
      resolveAuthorizationForSwagger(req.headers),
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: { headers: { authorization?: string; referer?: string } },
  ) {
    return this.service.findOne(
      id,
      resolveAuthorizationForSwagger(req.headers),
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUsersDto,
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
