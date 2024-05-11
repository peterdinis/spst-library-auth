import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
    const app = (await NestFactory.create(AppModule)) as INestApplication;
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle('Spšt Knižnica Autentifikačný server')
        .setDescription('Autentifikačný server pre projekt SPŠT Knižnica')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(4000);
}
bootstrap();
