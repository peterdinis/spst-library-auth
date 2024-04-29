import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async findOneUser(id: string) {
        const oneUser = await this.prismaService.user.findFirst({
          where: {
            id,
          },
        });
    
        if (!oneUser) {
          throw new NotFoundException('Používateľa s týmto id som nenašiel');
        }
    
        return oneUser;
      }

      async findOneByEmail(email: string) {
        const oneUser = await this.prismaService.user.findFirst({
          where: {
            email,
          },
        });
    
        if (!oneUser) {
          throw new NotFoundException('Používateľa s týmto emailom som nenašiel');
        }
    
        return oneUser;
      }
}