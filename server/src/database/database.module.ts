import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';
import { envConfig } from '../config/env.config';
import { PG_POOL, pgProvider } from './pg.provider';

class DatabaseShutdownService implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: '.env',
    }),
  ],
  providers: [pgProvider, DatabaseShutdownService],
  exports: [PG_POOL],
})
export class DatabaseModule {}
