import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './loggers/winston-logger';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './utils/exception/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { SuccessInterceptor } from './utils/interceptors/success.interceptor';
import * as expressBasicAuth from 'express-basic-auth';
import { ValidationException } from './utils/exception/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger
    })
  });

  // 전역 파이프 설정
  app.useGlobalPipes( 
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      },
      whitelist: true,
      exceptionFactory: () => {
        return new ValidationException();
      }
    }),
  );
  
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  // 전역 prefix 설정
  app.setGlobalPrefix('/api'); 
  
  // Swagger UI 접근 제한
  app.use(['/swagger-ui'], expressBasicAuth({
    challenge: true,
    users: {
      [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD
    }
  }),);

  // 전역 swagger 설정
  const config = new DocumentBuilder()
    .setTitle('bebesnap API document')
    .setDescription('bebesnap API document')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT Auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha'
    }
  });
  
  // CORS 설정
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: true
  });

  // Helmet 설정, HTTP 요청 헤더 숨김
  app.use(helmet.hidePoweredBy());

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
