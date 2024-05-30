import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        MongooseModule.forRoot(process.env.DATABASE_URI, {
            dbName: process.env.DATABASE_NAME,
            auth: {
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASS,
            },
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60,
                limit: 10,
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
