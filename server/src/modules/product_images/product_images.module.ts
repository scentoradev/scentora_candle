import { Module } from '@nestjs/common';
import { ProductImagesController } from './product_images.controller';
import { ProductImagesService } from './product_images.service';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
