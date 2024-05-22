import { Injectable } from "@nestjs/common";
import { ResendService } from "nestjs-resend";

@Injectable()
export class EmailsService {
  constructor(private readonly resendService: ResendService) {}

  async sendEmail() {
    
  }
}