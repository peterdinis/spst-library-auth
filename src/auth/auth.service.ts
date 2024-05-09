import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { compare } from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { ADMIN, EXPIRE_TIME, STUDENT, TEACHER } from './constants/roles';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDto.email,
        AND: {
          isActive: {
            not: false,
          },
        },
      },
    });

    const checkPasswords = compare(loginDto.password, user.password);

    if (!checkPasswords) {
      throw new ForbiddenException('Heslá sa nezhodujú');
    }

    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Zlé prihlasovacie údaje');
    }
  }

  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  async findAllStudents() {
    return this.usersService.findAllWithRole(STUDENT);
  }

  async findAllTeachers() {
    return this.usersService.findAllWithRole(TEACHER);
  }

  async findAllAdmins() {
    return this.usersService.findAllWithRole(ADMIN);
  }

  async createNewUser(registerDto: CreateUserDto) {
    await this.usersService.findOneByEmail(registerDto.email);

    const salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto
      .pbkdf2Sync(registerDto.password, salt, 1000, 64, 'sha512')
      .toString('hex');

    const addNewUser = await this.prismaService.user.create({
      data: {
        ...registerDto,
        isActive: true,
        password: hash,
      },
    });

    if (!addNewUser) {
      throw new BadRequestException('Nastala chyba pri registrácií');
    }

    const { ...result } = addNewUser;

    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(user, {
          expiresIn: '20s',
          secret: process.env.JWT_SECRET as unknown as string,
        }),
        refreshToken: await this.jwtService.signAsync(user, {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET as unknown as string,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '20s',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async deleteAccount(accountId: string) {
    const findOneUser = await this.usersService.findOneUser(accountId);

    const deleteAccount = await this.prismaService.user.delete({
      where: {
        id: findOneUser.id,
      },
    });

    if (!deleteAccount) {
      throw new ConflictException('Nepodarilo sa zmazať účet');
    }

    return deleteAccount;
  }

  async deactivateAccount(accountId: string) {
    const findOneUser = await this.usersService.findOneUser(accountId);

    const deactivateAccount = await this.prismaService.user.update({
      where: {
        id: findOneUser.id,
      },

      data: {
        isActive: false,
      },
    });

    if (!deactivateAccount) {
      throw new ConflictException('Nepodarilo sa deaktivovať účet');
    }

    return deactivateAccount;
  }

  async makeAccountAdmin(accountId: string) {
    const findOneUser = await this.usersService.findOneUser(accountId);

    if (findOneUser.role === 'STUDENT') {
      throw new BadRequestException('Študent nemôže mať admin práva');
    }

    const updateAdminRights = await this.prismaService.user.update({
      where: {
        id: findOneUser.id,
      },
      data: {
        hasAdminRights: true,
      },
    });

    return updateAdminRights;
  }

  async removeAdminRights(accountId: string) {
    const findOneUser = await this.usersService.findOneUser(accountId);

    if (findOneUser.role === 'STUDENT') {
      throw new BadRequestException('Chyba Študent nemôže mať admin práva');
    }

    const updateAdminRights = await this.prismaService.user.update({
      where: {
        id: findOneUser.id,
      },
      data: {
        hasAdminRights: false,
      },
    });

    return updateAdminRights;
  }
}
