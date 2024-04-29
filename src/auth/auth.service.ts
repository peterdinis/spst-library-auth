import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import {compare } from 'bcrypt';
import * as crypto from "crypto";
import { LoginDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
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

    // const checkPasswords = compare(loginDto.password, user.password);

    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Zlé prihlasovacie údaje');
    }
  }

  async getAllUsers() {
    const allUsers = await this.prismaService.user.findMany();
    if (!allUsers) {
      throw new NotFoundException('Nenašiel som žiadných ľudí');
    }

    return allUsers;
  }

  async findAllStudents() {
    const allStudents = await this.prismaService.user.findMany({
      where: {
        role: 'STUDENT',
      },
    });
    if (!allStudents) {
      throw new NotFoundException('Nenašiel som žiadných študentov');
    }

    return allStudents;
  }

  async findAllTeachers() {
    const allTeachers = await this.prismaService.user.findMany({
      where: {
        role: 'TEACHER',
      },
    });
    if (!allTeachers) {
      throw new NotFoundException('Nenašiel som žiadných učiteľov');
    }

    return allTeachers;
  }

  async createNewUser(registerDto: CreateUserDto) {
    const newUser = await this.prismaService.user.findFirst({
      where: {
        email: registerDto.email,
      },
    });

    if (newUser) {
      throw new ConflictException('Používateľ s týmto emailom existuje');
    }

    const salt = crypto.randomBytes(16).toString("hex");

    const hash = crypto.pbkdf2Sync(registerDto.password, salt, 1000, 64, "sha512").toString("hex");

    const addNewUser = await this.prismaService.user.create({
      data: {
        ...registerDto,
        isActive: true,
        password: hash
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
          secret: process.env.JWT_SECRET as unknown as string
        }),
        refreshToken: await this.jwtService.signAsync(user, {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET as unknown as string
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

  async updateAccount(updateDto: UpdateUserDto) {
    const findOneUser = await this.usersService.findOneByEmail(updateDto.email);

    const updateUser = await this.prismaService.user.update({
      where: {
        id: findOneUser.id,
      },

      data: {
        ...updateDto,
      },
    });

    if (!updateUser) {
      throw new ForbiddenException('Uprava zlyhala');
    }

    return updateUser;
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
        hasAdminRights: false
      },
    });

    return updateAdminRights;
  }
}
