import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
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
import { LoginDto } from './dto/login-user-dto';
import { UsersService } from './users.service';
import { AdminRightsDto } from './dto/admin-rights-dto';
import { RemoveAccountDto } from './dto/remove-account-dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    @ApiOperation({
        summary: 'Get all users',
    })
    @ApiOkResponse({
        type: [ViewUserDto],
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
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
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Get('/user/:id')
    async getOneUser(@Param('id') id: string) {
        return this.userService.findOneUser(id);
    }

    @ApiOperation({
        summary: 'Get all students',
    })
    @ApiOkResponse({
        type: [ViewUserDto],
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Get('/students')
    async findAllStudents() {
        return this.authService.findAllStudents();
    }

    @ApiOperation({
        summary: 'Get all teachers',
    })
    @ApiOkResponse({
        type: [ViewUserDto],
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Get('/teachers')
    async findAllTeachers() {
        return this.authService.findAllTeachers();
    }

    @ApiOperation({
        summary: 'Admin and teachers all',
    })
    @ApiOkResponse()
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Get('/all/teachers/admins')
    async allAdminsAndTeachers() {
        return this.authService.teacherAdminsAll();
    }

    @ApiOperation({
        summary: 'Get all admins',
    })
    @ApiOkResponse({
        type: [ViewUserDto],
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Get('/admins')
    async findAllAdmins() {
        return this.authService.findAllAdmins();
    }

    @ApiOperation({
        summary: 'Create a new user',
    })
    @ApiCreatedResponse({
        type: ViewUserDto,
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('/register')
    async createNewUser(@Body() registerDto: CreateUserDto) {
        return this.authService.createNewUser(registerDto);
    }

    @ApiOperation({
        summary: 'Login new user',
    })
    @ApiCreatedResponse({
        type: LoginDto,
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('/login')
    async loginUser(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @ApiOperation({
        summary: 'Delete user account',
    })
    @ApiOkResponse({
        type: ViewUserDto,
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch('/account/delete')
    async deleteAccount(@Body() removeAccount: RemoveAccountDto) {
        return this.authService.deleteAccount(removeAccount);
    }

    @ApiOperation({
        summary: 'Deactivate user account',
    })
    @ApiOkResponse({
        type: ViewUserDto,
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch('/account/deactivate')
    async deactivateAccount(@Body() removeAccount: RemoveAccountDto) {
        return this.authService.deactivateAccount(removeAccount);
    }

    @ApiOperation({
        summary: 'Make user account admin',
    })
    @ApiOkResponse({
        type: ViewUserDto,
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch('/account/make-admin')
    async makeAccountAdmin(@Body() rightsDto: AdminRightsDto) {
        return this.authService.makeAccountAdmin(rightsDto);
    }

    @ApiOperation({
        summary: 'Remove admin rights',
    })
    @ApiOkResponse({
        type: ViewUserDto,
    })
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch('/account/remove-admin')
    async removeAccountAdmin(@Body() rightsDto: AdminRightsDto) {
        return this.authService.removeAdminRights(rightsDto);
    }
}
