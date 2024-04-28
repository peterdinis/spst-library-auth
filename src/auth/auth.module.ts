import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET as unknown as string,
    signOptions: { expiresIn: '86 400s' },
  }),],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
