import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { PG_POOL } from './database/pg.provider';
import { setupSwagger, SWAGGER_PATH } from './swagger/swagger.config';

type QueryablePool = {
  query: (sql: string) => Promise<unknown>;
};

function isPgPool(value: unknown): value is QueryablePool {
  return (
    typeof value === 'object' &&
    value !== null &&
    'query' in value &&
    typeof (value as { query?: unknown }).query === 'function'
  );
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  setupSwagger(app);

  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? 'localhost';

  const poolCandidate: unknown = app.get(PG_POOL);
  if (isPgPool(poolCandidate)) {
    try {
      await poolCandidate.query('SELECT 1');
      logger.log('Database: connected');
    } catch (error) {
      logger.error(
        'Database: connection failed',
        error instanceof Error ? error.stack : undefined,
      );
    }
  } else {
    logger.error('Database: pool provider is invalid');
  }

  await app.listen(port);

  const apiBaseUrl = `http://${host}:${port}`;
  logger.log(`Server running on: ${apiBaseUrl}`);
  logger.log(`Swagger docs: ${apiBaseUrl}/${SWAGGER_PATH}`);
  logger.log(`Port: ${port}`);
}
void bootstrap();
