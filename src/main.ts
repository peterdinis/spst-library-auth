import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: true,
        }),
    );

    app.enableCors();

    const PORT = (process.env.PORT as unknown as number) || 4000;

    const config = new DocumentBuilder()
        .setTitle('Spšt Knižnica Autentifikačný server')
        .setDescription('Autentifikačný server pre projekt SPŠT Knižnica')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT, '0.0.0.0');
}
bootstrap();
