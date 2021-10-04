import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserDTO, UserRO } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../shared/auth.guard';
import { Pagination } from 'src/types/pagination.interface';
import { Request } from 'express';

@Controller()
export class UserController {
    constructor(private userService: UserService) {}

    @Get('api/users')
    @UseGuards(new AuthGuard())
    findAll(
        @Req() request: Request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    ): Promise<Pagination<UserRO>> {
        return this.userService.findAllUsers(request.route.path, page);
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
