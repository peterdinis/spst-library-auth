import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from 'src/emails/emails.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        EmailsModule,
        MongooseModule.forRoot(process.env.DATABASE_URI, {
            dbName: process.env.DATABASE_NAME,
            auth: {
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASS,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
