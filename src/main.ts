import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 100;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: RATE_LIMIT_WINDOW,
      max: MAX_REQUESTS_PER_WINDOW
    })
  );
  await app.listen(3000);
}
bootstrap();
