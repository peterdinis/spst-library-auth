import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Example')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({
        summary: 'Testing endpoint for our auth server',
    })
    @ApiOkResponse()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
