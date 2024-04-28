import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth endpoints")
@Controller('auth')
export class AuthController {}
