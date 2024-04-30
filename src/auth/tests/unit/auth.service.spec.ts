import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login-user-dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user credentials and return user if valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: await hash('password', 10),
      };
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
      jest.spyOn(compare, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(loginDto);

      expect(result).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.validateUser(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
    });

    it('should throw NotFoundException if no users found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      await expect(service.getAllUsers()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  // Additional test cases for other methods can be added similarly

  afterEach(() => {
    jest.clearAllMocks();
  });
});
