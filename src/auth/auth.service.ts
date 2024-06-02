import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { ADMIN, EXPIRE_TIME, STUDENT, TEACHER } from './constants/roles';
import { AdminRightsDto } from './dto/admin-rights-dto';
import { RemoveAccountDto } from './dto/remove-account-dto';
import { User } from './model/User.model';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async teacherAdminsAll() {
        const findSpecificUsers = await this.userModel
            .find({
                $or: [{ role: TEACHER }, { role: ADMIN }],
            })
            .exec();

        if (!findSpecificUsers || findSpecificUsers.length === 0) {
            throw new NotFoundException(
                'Žiadny učitelia/admini nemajú v applikácií vytvorené učty',
            );
        }

        return findSpecificUsers;
    }

    async validateUser(loginDto: LoginDto) {
        const user = await this.userModel
            .findOne({
                email: loginDto.email,
                isActive: { $ne: false },
            })
            .exec();

        if (!user) {
            throw new UnauthorizedException('Zlé prihlasovacie údaje');
        }

        /* TODO: Must be fixed */
        /* const checkPasswords = await argon2.verify(loginDto.password, user.password);
       if (!checkPasswords) {
            throw new ForbiddenException('Heslá sa nezhodujú');
        } */

        const { password, ...result } = user.toObject();
        return result;
    }

    async getAllUsers() {
        return this.usersService.findAllUsers();
    }

    async findAllStudents() {
        return this.usersService.findAllWithRole(STUDENT);
    }

    async findAllTeachers() {
        return this.usersService.findAllWithRole(TEACHER);
    }

    async findAllAdmins() {
        return this.usersService.findAllWithRole(ADMIN);
    }

    async createNewUser(registerDto: CreateUserDto) {
        const existingUser = await this.usersService.findOneByEmail(
            registerDto.email,
        );
        if (existingUser) {
            throw new ConflictException(
                'Používateľ s týmto emailom už existuje',
            );
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto
            .pbkdf2Sync(registerDto.password, salt, 1000, 64, 'sha512')
            .toString('hex');

        const newUser = new this.userModel({
            ...registerDto,
            isActive: true,
            password: hash,
        });

        try {
            const addNewUser = await newUser.save();
            const { password, ...result } = addNewUser.toObject();
            return result;
        } catch (error) {
            throw new BadRequestException('Nastala chyba pri registrácií');
        }
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);

        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(user, {
                    expiresIn: '1d',
                    secret: process.env.JWT_SECRET as unknown as string,
                }),
                refreshToken: await this.jwtService.signAsync(user, {
                    expiresIn: '7d',
                    secret: process.env.JWT_SECRET as unknown as string,
                }),
                expiresIn: new Date().setTime(
                    new Date().getTime() + EXPIRE_TIME,
                ),
            },
        };
    }

    async refreshToken(user: any) {
        const payload = {
            username: user.name,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1d',
                secret: process.env.JWT_SECRET as unknown as string,
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: process.env.JWT_SECRET as unknown as string,
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        };
    }

    async deleteAccount(removeAccount: RemoveAccountDto) {
        const findOneAppUser = await this.usersService.findOneUser(
            removeAccount.accountId,
        );

        const deleteAccount = await this.userModel
            .findByIdAndDelete(findOneAppUser.id)
            .exec();

        if (!deleteAccount) {
            throw new ConflictException('Nepodarilo sa zmazať účet');
        }

        return deleteAccount;
    }

    async deactivateAccount(removeAccount: RemoveAccountDto) {
        const findOneAppUser = await this.usersService.findOneUser(
            removeAccount.accountId,
        );

        const deactivateAccount = await this.userModel
            .findByIdAndUpdate(
                findOneAppUser.id,
                { isActive: false },
                { new: true },
            )
            .exec();

        if (!deactivateAccount) {
            throw new ConflictException('Nepodarilo sa deaktivovať účet');
        }

        return deactivateAccount;
    }

    async makeAccountAdmin(rightsDto: AdminRightsDto) {
        const findOneAppUser = await this.usersService.findOneUser(
            rightsDto.accountId,
        );

        if (findOneAppUser.role === STUDENT) {
            throw new BadRequestException('Študent nemôže mať admin práva');
        }

        const updatedUser = await this.userModel
            .findByIdAndUpdate(
                findOneAppUser.id,
                { hasAdminRights: true },
                { new: true },
            )
            .exec();

        return updatedUser;
    }

    async removeAdminRights(rightsDto: AdminRightsDto) {
        const findOneAppUser = await this.usersService.findOneUser(
            rightsDto.accountId,
        );

        if (findOneAppUser.role === STUDENT) {
            throw new BadRequestException(
                'Chyba Študent nemôže mať admin práva',
            );
        }

        const updateAdminRights = await this.userModel
            .findByIdAndUpdate(
                findOneAppUser.id,
                { hasAdminRights: false },
                { new: true },
            )
            .exec();

        return updateAdminRights;
    }
}
