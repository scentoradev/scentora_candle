import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('env', () => ({
  databaseUrl: process.env.DATABASE_URL ?? '',
}));
