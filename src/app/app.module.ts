import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesGatewayModule } from 'src/messages/messages.module';
import { AppGateway } from './app.gateway';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        MessagesGatewayModule
    ],
    controllers: [AppController],
    providers: [AppService, AppGateway],
})
export class AppModule {}
