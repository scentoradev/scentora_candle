import { Module } from '@nestjs/common';
import { ContentPagesController } from './content_pages.controller';
import { ContentPagesService } from './content_pages.service';

@Module({
  controllers: [ContentPagesController],
  providers: [ContentPagesService],
})
export class ContentPagesModule {}
