import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ViewUserDto } from './dto/view-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { LoginDto } from './dto/login-user-dto';
import { RefreshJwtGuard } from './guards/refresh.guard';

@ApiTags('Auth endpoints')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiOkResponse({
    type: [ViewUserDto],
  })
  @Get('/users')
  async allUsers() {
    return this.authService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Get one user by id',
  })
  @ApiOkResponse({
    type: ViewUserDto,
  })
  @Get('/users/:id')
  async getOneUser(@Param('id') id: string) {
    return this.authService.findOneUser(id);
  }

  @ApiOperation({
    summary: 'Get all students',
  })
  @ApiOkResponse({
    type: [ViewUserDto],
  })
  @Get('/users/students')
  async findAllStudents() {
    return this.authService.findAllStudents();
  }

  @ApiOperation({
    summary: 'Get all teachers',
  })
  @ApiOkResponse({
    type: [ViewUserDto],
  })
  @Get('/users/teachers')
  async findAllTeachers() {
    return this.authService.findAllTeachers();
  }

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiCreatedResponse({
    type: ViewUserDto,
  })
  @Post('/users')
  async createNewUser(@Body() registerDto: CreateUserDto) {
    return this.authService.createNewUser(registerDto);
  }

  @ApiOperation({
    summary: 'Login new user',
  })
  @ApiCreatedResponse({
    type: LoginDto,
  })
  @Post('/users/login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    console.log('refreshed');

    return await this.authService.refreshToken(req.user);
  }

  @ApiOperation({
    summary: 'Update user account',
  })
  @ApiOkResponse({
    type: ViewUserDto,
  })
  @Put('/users/:id')
  async updateAccount(@Body() updateDto: UpdateUserDto) {
    return this.authService.updateAccount(updateDto);
  }

  @ApiOperation({
    summary: 'Delete user account',
  })
  @ApiOkResponse({
    type: ViewUserDto,
  })
  @Delete('/users/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.authService.deleteAccount(id);
  }

  @ApiOperation({
    summary: 'Deactivate user account',
  })
  @ApiOkResponse({
    type: ViewUserDto,
  })
  @Patch('/users/:id/deactivate')
  async deactivateAccount(@Param('id') id: string) {
    return this.authService.deactivateAccount(id);
  }

  @ApiOperation({
    summary: 'Make user account admin',
  })
  @ApiOkResponse({
    type: ViewUserDto,
  })
  @Patch('/users/:id/make-admin')
  async makeAccountAdmin(@Param('id') id: string) {
    return this.authService.makeAccountAdmin(id);
  }
}
