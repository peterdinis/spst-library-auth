import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from './dto/send-email-dto';

@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
    constructor(private readonly emailsService: EmailsService) {}

    @ApiOperation({
        summary: 'Send email',
    })
    @ApiCreatedResponse()
    @Post('/send')
    async sendEmail(@Body() sendDto: SendEmailDto) {
        await this.emailsService.sendEmail(sendDto);
    }
}
