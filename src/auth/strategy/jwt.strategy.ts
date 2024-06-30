
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET, // Use your JWT secret here
        });
    }

    async validate(payload: {sub: string}) {
        const user = await this.userService.findOneUser(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}