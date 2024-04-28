import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
    ) {}

    async getAllUsers() {
        const allUsers = await this.prismaService.user.findMany();
        if(!allUsers) {
            throw new NotFoundException("Nenašiel som žiadných ľudí");
        }

        return allUsers;
    }

    async findOneUser(id: string) {
        const oneUser = await this.prismaService.user.findFirst({
            where: {
                id
            }
        })

        if(!oneUser) {
            throw new NotFoundException("Používateľa s týmto id som nenašiel");
        }

        return oneUser;
    }

    async findAllStudents() {
        const allStudents = await this.prismaService.user.findMany({
            where: {
                role: "STUDENT"
            }
        });
        if(!allStudents) {
            throw new NotFoundException("Nenašiel som žiadných študentov");
        }

        return allStudents;
    }

    async findAllTeachers() {
        const allTeachers = await this.prismaService.user.findMany({
            where: {
                role: "TEACHER"
            }
        });
        if(!allTeachers) {
            throw new NotFoundException("Nenašiel som žiadných učiteľov");
        }

        return allTeachers;
    }
}
