import { Injectable } from '@nestjs/common';
import { CreateCouponsDto } from './dto/create_coupons.dto';
import { UpdateCouponsDto } from './dto/update_coupons.dto';
import { QueryCouponsDto } from './dto/query_coupons.dto';
import { CouponsRecord } from './interfaces/coupons.interface';

export interface CouponsSingleResponse {
  message: string;
  id: string;
}

export interface CouponsCreateResponse {
  message: string;
  data: CreateCouponsDto;
}

export interface CouponsBulkCreateResponse {
  message: string;
  count: number;
  data: CreateCouponsDto[];
}

export interface CouponsListResponse {
  message: string;
  query: QueryCouponsDto;
  items: CouponsRecord[];
}

export interface CouponsUpdateResponse {
  message: string;
  id: string;
  data: UpdateCouponsDto;
}

@Injectable()
export class CouponsService {
  create(dto: CreateCouponsDto): CouponsCreateResponse {
    return {
      message: 'Create coupons',
      data: dto,
    };
  }

  bulkCreate(payload: CreateCouponsDto[]): CouponsBulkCreateResponse {
    return {
      message: 'Bulk create coupons',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryCouponsDto): CouponsListResponse {
    return {
      message: 'List coupons',
      query: query,
      items: [] as CouponsRecord[],
    };
  }

  search(query: QueryCouponsDto): CouponsListResponse {
    return {
      message: 'Search coupons',
      query: query,
      items: [] as CouponsRecord[],
    };
  }

  findOne(id: string): CouponsSingleResponse {
    return {
      message: 'Get coupons by id',
      id,
    };
  }

  update(id: string, dto: UpdateCouponsDto): CouponsUpdateResponse {
    return {
      message: 'Update coupons',
      id,
      data: dto,
    };
  }

  restore(id: string): CouponsSingleResponse {
    return {
      message: 'Restore coupons',
      id,
    };
  }

  remove(id: string): CouponsSingleResponse {
    return {
      message: 'Soft delete coupons',
      id,
    };
  }

  hardRemove(id: string): CouponsSingleResponse {
    return {
      message: 'Hard delete coupons',
      id,
    };
  }
}
