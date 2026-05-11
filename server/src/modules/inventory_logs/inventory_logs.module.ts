import { Module } from '@nestjs/common';
import { InventoryLogsController } from './inventory_logs.controller';
import { InventoryLogsService } from './inventory_logs.service';

@Module({
  controllers: [InventoryLogsController],
  providers: [InventoryLogsService],
  exports: [InventoryLogsService],
})
export class InventoryLogsModule {}
