import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UsersService } from '../../users.service';
import { faker } from '@faker-js/faker';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAllUsers', () => {
    it('should return all users as ViewUserDto array', async () => {
      const mockUsers = [
        {
          id: faker.string.uuid(),
          name: faker.internet.userName(),
          lastName: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'user',
          isActive: true,
          hasAdminRights: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: faker.string.uuid(),
          name: faker.internet.userName(),
          lastName: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'admin',
          isActive: true,
          hasAdminRights: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await usersService.findAllUsers();

      expect(result).toEqual(
        mockUsers.map((user) => ({
          id: faker.string.uuid(),
          name: faker.internet.userName(),
          lastName: faker.internet.userName(),
          email: faker.internet.email(),
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      );
    });

    it('should throw NotFoundException if no users found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      await expect(usersService.findAllUsers()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneUser', () => {
    it('should return one user as ViewUserDto', async () => {
      const mockUser = {
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        lastName: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'user',
        isActive: true,
        hasAdminRights: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await usersService.findOneUser('1');

      expect(result).toEqual({
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        lastName: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(usersService.findOneUser('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
