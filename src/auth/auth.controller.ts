import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ViewUserDto } from './dto/view-user-dto';

@ApiTags("Auth endpoints")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: "Return all users"
    })
    @ApiOkResponse({
        type: [ViewUserDto]
    })
    @Get("/users")
    async allUsers() {
        return this.authService.getAllUsers();
    }

    @ApiOperation({
        summary: "Find one user by id"
    })
    @ApiOkResponse({
        type: ViewUserDto
    })
    @Get("/users/:id")
    async getOneUser(@Param("id") id: string) {
        return this.authService.findOneUser(id);
    }
}
