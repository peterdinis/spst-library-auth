import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AdminRightsDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountId: string;
}