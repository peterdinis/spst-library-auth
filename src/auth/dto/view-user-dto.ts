import { ApiProperty } from "@nestjs/swagger";

export class ViewUserDto {
   @ApiProperty()
   id: string;

   @ApiProperty()
   name: string;

   @ApiProperty()
   lastName: string;

   @ApiProperty()
   email: string;

   @ApiProperty()
   password: string;

   @ApiProperty()
   role: string;

   @ApiProperty()
   isActive: boolean;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}