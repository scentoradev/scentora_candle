import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

export const pgProvider: Provider = {
  provide: PG_POOL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('env.databaseUrl');

    if (!connectionString) {
      throw new Error('DATABASE_URL is missing in environment variables.');
    }

    return new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  },
};
