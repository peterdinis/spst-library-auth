import { ForbiddenException, Injectable } from "@nestjs/common";
import { ResendService } from "nestjs-resend";
import { SendEmailDto } from "./dto/send-email-dto";

@Injectable()
export class EmailsService {
  constructor(private readonly resendService: ResendService) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    const newEmail = await this.resendService.send({
        from: "Acme <onboarding@resend.dev>",
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        text: sendEmailDto.text
    });

    if(!newEmail) {
      throw new ForbiddenException("Failed to send email");
    }

    return newEmail;
  }
}