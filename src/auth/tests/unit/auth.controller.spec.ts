import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user-dto';
import { LoginDto } from 'src/auth/dto/login-user-dto';
import { UpdateUserDto } from 'src/auth/dto/update-user-dto';
import { ViewUserDto } from 'src/auth/dto/view-user-dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAllUsers: jest.fn(),
            findOneUser: jest.fn(),
            findAllStudents: jest.fn(),
            findAllTeachers: jest.fn(),
            createNewUser: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            updateAccount: jest.fn(),
            deleteAccount: jest.fn(),
            deactivateAccount: jest.fn(),
            makeAccountAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('allUsers', () => {
    it('should return an array of users', async () => {
      const users: ViewUserDto[] = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];
      jest.spyOn(authService, 'getAllUsers').mockResolvedValue(users);

      expect(await controller.allUsers()).toEqual(users);
    });
  });

  describe('getOneUser', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const user: ViewUserDto = { id: userId, name: 'User 1' };
      jest.spyOn(authService, 'findOneUser').mockResolvedValue(user);

      expect(await controller.getOneUser(userId)).toEqual(user);
    });
  });

  describe('findAllStudents', () => {
    it('should return an array of students', async () => {
      const students: ViewUserDto[] = [
        { id: '1', name: 'Student 1' },
        { id: '2', name: 'Student 2' },
      ];
      jest.spyOn(authService, 'findAllStudents').mockResolvedValue(students);

      expect(await controller.findAllStudents()).toEqual(students);
    });
  });

  describe('findAllTeachers', () => {
    it('should return an array of teachers', async () => {
      const teachers: ViewUserDto[] = [
        { id: '1', name: 'Teacher 1' },
        { id: '2', name: 'Teacher 2' },
      ];
      jest.spyOn(authService, 'findAllTeachers').mockResolvedValue(teachers);

      expect(await controller.findAllTeachers()).toEqual(teachers);
    });
  });

  describe('createNewUser', () => {
    it('should create a new user', async () => {
      const newUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password',
      };
      const createdUser: ViewUserDto = {
        id: '1',
        name: newUserDto.name,
        email: newUserDto.email,
      };
      jest.spyOn(authService, 'createNewUser').mockResolvedValue(createdUser);

      expect(await controller.createNewUser(newUserDto)).toEqual(createdUser);
    });
  });

  describe('loginUser', () => {
    it('should authenticate and return login credentials', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password',
      };
      const loginResponse: LoginDto = {
        accessToken: 'token',
        refreshToken: 'refresh-token',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      expect(await controller.loginUser(loginDto)).toEqual(loginResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh user token', async () => {
      const req = { user: { id: '1', name: 'User' } };
      const refreshedToken: string = 'new-access-token';
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshedToken);

      expect(await controller.refreshToken(req)).toEqual(refreshedToken);
    });
  });

  describe('updateAccount', () => {
    it('should update user account', async () => {
      const updateDto: UpdateUserDto = { id: '1', name: 'Updated User' };
      const updatedUser: ViewUserDto = {
        id: updateDto.id,
        name: updateDto.name,
      };
      jest.spyOn(authService, 'updateAccount').mockResolvedValue(updatedUser);

      expect(await controller.updateAccount(updateDto)).toEqual(updatedUser);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account by id', async () => {
      const userId = '1';
      const deletedUser: ViewUserDto = { id: userId, name: 'Deleted User' };
      jest.spyOn(authService, 'deleteAccount').mockResolvedValue(deletedUser);

      expect(await controller.deleteAccount(userId)).toEqual(deletedUser);
    });
  });

  describe('deactivateAccount', () => {
    it('should deactivate user account by id', async () => {
      const userId = '1';
      const deactivatedUser: ViewUserDto = {
        id: userId,
        name: 'Deactivated User',
      };
      jest
        .spyOn(authService, 'deactivateAccount')
        .mockResolvedValue(deactivatedUser);

      expect(await controller.deactivateAccount(userId)).toEqual(
        deactivatedUser,
      );
    });
  });

  describe('makeAccountAdmin', () => {
    it('should make user account admin by id', async () => {
      const userId = '1';
      const adminUser: ViewUserDto = {
        id: userId,
        name: 'Admin User',
        isAdmin: true,
      };
      jest.spyOn(authService, 'makeAccountAdmin').mockResolvedValue(adminUser);

      expect(await controller.makeAccountAdmin(userId)).toEqual(adminUser);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
