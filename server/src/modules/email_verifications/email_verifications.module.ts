import { Module } from '@nestjs/common';
import { EmailVerificationsController } from './email_verifications.controller';
import { EmailVerificationsService } from './email_verifications.service';

@Module({
  controllers: [EmailVerificationsController],
  providers: [EmailVerificationsService],
  exports: [EmailVerificationsService],
})
export class EmailVerificationsModule {}
