import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString} from "class-validator";

export class SendEmailDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    from: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    to: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;
}