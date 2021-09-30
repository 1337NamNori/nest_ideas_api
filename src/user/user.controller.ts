import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDTO, UserRO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private userService: UserService) {}

    @Get('api/users')
    findAll(): Promise<UserRO[]> {
        return this.userService.findAllUsers();
    }   

    @Post('register')
    register(@Body() data: UserDTO): Promise<UserRO> {
        return this.userService.register(data);
    }

    @Post('login')
    login(@Body() data: UserDTO): Promise<UserRO> {
        return this.userService.login(data);
    }
}
