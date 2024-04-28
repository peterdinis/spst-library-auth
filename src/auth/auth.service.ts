import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { hash, compare } from 'bcrypt';
import { LoginDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(loginDto: LoginDto) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: loginDto.email
            }
        })

        if (user && (await compare(loginDto.password, user.password))) {
            const { password, ...result } = user;
            return result;
        } else {
            throw new UnauthorizedException("Zlé prihlasovacie údaje");
        }
    }

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

    async createNewUser(registerDto: CreateUserDto) {
        const newUser = await this.prismaService.user.findFirst({
            where: {
                email: registerDto.email
            }
        })

        if(newUser) {
            throw new ConflictException("Používateľ s týmto emailom existuje");
        }

        const addNewUser = await this.prismaService.user.create({
            data: {
                ...registerDto,
                isActive: true,
                password: hash(registerDto.password, 10)
            }
        });

        if(!addNewUser) {
            throw new BadRequestException("Nastala chyba pri registrácií");
        }

        const {...result} = addNewUser;

        return result;
    }
}
