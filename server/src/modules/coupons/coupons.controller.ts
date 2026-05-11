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
import { CouponsService } from './coupons.service';
import type {
  CouponsBulkCreateResponse,
  CouponsCreateResponse,
  CouponsListResponse,
  CouponsSingleResponse,
  CouponsUpdateResponse,
} from './coupons.service';
import { CreateCouponsDto } from './dto/create_coupons.dto';
import { UpdateCouponsDto } from './dto/update_coupons.dto';
import { QueryCouponsDto } from './dto/query_coupons.dto';

type CouponsServiceContract = {
  create: (dto: CreateCouponsDto) => CouponsCreateResponse;
  bulkCreate: (payload: CreateCouponsDto[]) => CouponsBulkCreateResponse;
  findAll: (query: QueryCouponsDto) => CouponsListResponse;
  search: (query: QueryCouponsDto) => CouponsListResponse;
  findOne: (id: string) => CouponsSingleResponse;
  update: (id: string, dto: UpdateCouponsDto) => CouponsUpdateResponse;
  restore: (id: string) => CouponsSingleResponse;
  remove: (id: string) => CouponsSingleResponse;
  hardRemove: (id: string) => CouponsSingleResponse;
};

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  private readonly service: CouponsServiceContract;

  constructor(service: CouponsService) {
    this.service = service;
  }

  @Post()
  create(@Body() dto: CreateCouponsDto): CouponsCreateResponse {
    return this.service.create(dto);
  }

  @Post('bulk_create')
  bulkCreate(@Body() payload: CreateCouponsDto[]): CouponsBulkCreateResponse {
    return this.service.bulkCreate(payload);
  }

  @Get()
  findAll(@Query() query: QueryCouponsDto): CouponsListResponse {
    return this.service.findAll(query);
  }

  @Get('search')
  search(@Query() query: QueryCouponsDto): CouponsListResponse {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): CouponsSingleResponse {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCouponsDto,
  ): CouponsUpdateResponse {
    return this.service.update(id, dto);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string): CouponsSingleResponse {
    return this.service.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): CouponsSingleResponse {
    return this.service.remove(id);
  }

  @Delete(':id/hard')
  hardRemove(@Param('id') id: string): CouponsSingleResponse {
    return this.service.hardRemove(id);
  }
}
