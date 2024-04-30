import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as unknown as string,
      signOptions: { expiresIn: process.env.EXPIRES_IN as unknown as string },
    }),
  ],
  providers: [AuthService, JwtService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
