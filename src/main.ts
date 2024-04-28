import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as INestApplication;

  const config = new DocumentBuilder()
    .setTitle('Spšt Knižnica AUTH')
    .setDescription('Autentifikačný server pre spst knižnica')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
