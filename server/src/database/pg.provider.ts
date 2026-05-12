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

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      keepAlive: true,
    });

    pool.on('error', (error) => {
      // Supabase pooler can reset idle TLS connections; avoid crashing the process.
      // Requests will get a fresh client from pool on the next query.
      console.error('[PG_POOL] idle client error:', error.message);
    });

    return pool;
  },
};
