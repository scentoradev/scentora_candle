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

    const isLocalDb =
      connectionString.includes('localhost') ||
      connectionString.includes('127.0.0.1');

    const pool = new Pool({
      connectionString,
      ssl: isLocalDb ? false : { rejectUnauthorized: false },
      max: 5,
      min: 0,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      query_timeout: 60_000,
      statement_timeout: 60_000,
      maxLifetimeSeconds: 60,
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
