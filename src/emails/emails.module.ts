import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { ResendModule } from 'nestjs-resend';

@Module({
    imports: [
        ResendModule.forAsyncRoot({
            useFactory: async () => ({
                apiKey: process.env.RESEND_KEY as unknown as string,
            }),
        }),
    ],
    controllers: [EmailsController],
    providers: [EmailsService],
})
export class EmailsModule {}
