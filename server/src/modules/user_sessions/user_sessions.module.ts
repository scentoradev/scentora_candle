import { Module } from '@nestjs/common';
import { UserSessionsController } from './user_sessions.controller';
import { UserSessionsService } from './user_sessions.service';

@Module({
  controllers: [UserSessionsController],
  providers: [UserSessionsService],
  exports: [UserSessionsService],
})
export class UserSessionsModule {}
