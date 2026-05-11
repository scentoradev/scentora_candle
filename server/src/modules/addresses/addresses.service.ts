import { Injectable } from '@nestjs/common';
import { CreateAddressesDto } from './dto/create_addresses.dto';
import { UpdateAddressesDto } from './dto/update_addresses.dto';
import { QueryAddressesDto } from './dto/query_addresses.dto';
import { AddressesRecord } from './interfaces/addresses.interface';

@Injectable()
export class AddressesService {
  create(dto: CreateAddressesDto) {
    return {
      message: 'Create addresses',
      data: dto,
    };
  }

  bulkCreate(payload: CreateAddressesDto[]) {
    return {
      message: 'Bulk create addresses',
      count: payload.length,
      data: payload,
    };
  }

  findAll(query: QueryAddressesDto) {
    return {
      message: 'List addresses',
      query,
      items: [] as AddressesRecord[],
    };
  }

  search(query: QueryAddressesDto) {
    return {
      message: 'Search addresses',
      query,
      items: [] as AddressesRecord[],
    };
  }

  findOne(id: string) {
    return {
      message: 'Get addresses by id',
      id,
    };
  }

  update(id: string, dto: UpdateAddressesDto) {
    return {
      message: 'Update addresses',
      id,
      data: dto,
    };
  }

  restore(id: string) {
    return {
      message: 'Restore addresses',
      id,
    };
  }

  remove(id: string) {
    return {
      message: 'Soft delete addresses',
      id,
    };
  }

  hardRemove(id: string) {
    return {
      message: 'Hard delete addresses',
      id,
    };
  }
}
