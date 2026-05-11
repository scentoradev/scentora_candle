import { Injectable } from '@nestjs/common';
import { CreateReviewsDto } from './dto/create_reviews.dto';
import { UpdateReviewsDto } from './dto/update_reviews.dto';
import { QueryReviewsDto } from './dto/query_reviews.dto';
import { ReviewsRecord } from './interfaces/reviews.interface';

@Injectable()
export class ReviewsService {
  create(dto: CreateReviewsDto) {
    return {
      message: 'Create reviews',
      data: dto,
    };
  }

  bulkCreate(payload: CreateReviewsDto[]) {
    return {
      message: 'Bulk create reviews',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryReviewsDto) {
    return {
      message: 'List reviews',
      query,
      items: [] as ReviewsRecord[],
    };
  }

  search(query: QueryReviewsDto) {
    return {
      message: 'Search reviews',
      query,
      items: [] as ReviewsRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get reviews by id',
      id,
    };
  }

  update(id: string, dto: UpdateReviewsDto) {
    return {
      message: 'Update reviews',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore reviews',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete reviews',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete reviews',
      id,
    };
  }
}
