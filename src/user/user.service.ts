import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {}

    async getUserById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async findAllUsers(): Promise<UserRO[]> {
        const users = await this.userRepository.find();

        return users.map(user => user.toResponseObject());
    }
    
    async register(data: UserDTO): Promise<UserRO> {
        const {username, password} = data;
        const users = await this.userRepository.count({where: {username}});       
        
        if (users > 0) {
            throw new HttpException('Username already taken', HttpStatus.CONFLICT);
        }

        const user = await this.userRepository.create({username, password});
        await this.userRepository.save(user);

        return user.toResponseObject(true);
    }

    async login(data: UserDTO): Promise<UserRO> {
        const {username, password} = data;
        const user = await this.userRepository.findOne({where: {username}});

        if (!user || !(user.comparePassword(password)) || user.username !== username) {
            throw new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED);
        }

        return user.toResponseObject(true);
    }


}
