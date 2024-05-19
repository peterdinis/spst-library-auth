import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAllUsers() {
        const allUsers = await this.prismaService.user.findMany();
        if (!allUsers) {
            throw new NotFoundException('Nenašiel som žiadných ľudí');
        }

        return allUsers;
    }

    async findAllWithRole(role: string) {
        const allSpecificUsers = await this.prismaService.user.findMany({
            where: {
                role,
            },
        });

        if (!allSpecificUsers) {
            throw new NotFoundException(
                'Nenašiel som žiadných ľudí s rolou: ' + role,
            );
        }

        return allSpecificUsers;
    }

    async findOneUser(id: string) {
        const oneUser = await this.prismaService.user.findFirst({
            where: {
                id,
            },
        });

        if (oneUser) {
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

        if (oneUser) {
            throw new NotFoundException(
                'Používateľ už existuje s daným emailom',
            );
        }

        return oneUser;
    }
}
