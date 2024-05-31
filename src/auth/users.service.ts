import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/User.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findAllUsers() {
        const allUsers = await this.userModel.find().exec();
        if (!allUsers || allUsers.length === 0) {
            throw new NotFoundException('Nenašiel som žiadnych ľudí');
        }

        return allUsers;
    }

    async findAllWithRole(role: string) {
        const allSpecificUsers = await this.userModel.find({ role }).exec();

        if (!allSpecificUsers || allSpecificUsers.length === 0) {
            throw new NotFoundException(
                'Nenašiel som žiadnych ľudí s rolou: ' + role,
            );
        }

        return allSpecificUsers;
    }

    async findOneUser(id: string) {
        const oneUser = await this.userModel.findById(id).exec();

        if (oneUser) {
            throw new NotFoundException('Používateľ existuje s týmto id');
        }

        return oneUser;
    }

    async findOneByEmail(email: string) {
        const oneUser = await this.userModel.findOne({ email }).exec();

        if (oneUser) {
            throw new NotFoundException('Používateľ s daným už existuje');
        }

        return oneUser;
    }
}
