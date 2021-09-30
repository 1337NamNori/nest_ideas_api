import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDTO, UserRO } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../shared/auth.guard';

@Controller()
export class UserController {
    constructor(private userService: UserService) {}

    @Get('api/users')
    @UseGuards(new AuthGuard())
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
