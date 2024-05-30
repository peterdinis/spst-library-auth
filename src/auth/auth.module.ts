import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/User.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET as unknown as string,
            signOptions: {
                expiresIn: process.env.EXPIRES_IN as unknown as string,
            },
        }),
    ],
    providers: [AuthService, JwtService, UsersService],
    controllers: [AuthController],
})
export class AuthModule {}
