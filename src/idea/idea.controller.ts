import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import {Request} from 'express';
import { CommentDTO } from '../comment/dto/comment.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../shared/user.decorator';
import { UserRO } from '../user/dto/user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { IdeaDTO, IdeaRO } from './dto/idea.dto';
import { IdeaService } from './idea.service';
import { Pagination } from 'src/types/pagination.interface';

@Controller('api/ideas')
export class IdeaController {
    constructor(private ideaService: IdeaService) {}

    @Get()
    findAll(
        @Req() request: Request, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    ): Promise<Pagination<IdeaRO>> {
        return this.ideaService.findAllIdeas(request.route.path, page);
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    create(@User('id') userId: string, @Body() data: IdeaDTO): Promise<IdeaRO> {
        return this.ideaService.createIdea(data, userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.showIdea(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @User('id') userId: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.updateIdea(id, data, userId);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    remove(@Param('id') id: string, @User('id') userId: string): Promise<IdeaRO> {
        return this.ideaService.deleteIdea(id, userId);
    }

    @Post(':id/bookmarks')
    @UseGuards(new AuthGuard())
    bookmarks(@Param('id') id: string, @User('id') userId: string): Promise<UserRO> {
        return this.ideaService.bookmarks(id, userId);
    }

    @Post(':id/upvotes')
    @UseGuards(new AuthGuard())
    upvotes(@Param('id') id: string, @User('id') userId: string): Promise<IdeaRO> {
        return this.ideaService.upvotes(id, userId);
    }

    @Post(':id/downvotes')
    @UseGuards(new AuthGuard())
    downvotes(@Param('id') id: string, @User('id') userId: string): Promise<IdeaRO> {
        return this.ideaService.downvotes(id, userId);
    }

    @Post(':id/comments')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    comment(@Param('id') id: string, @User('id') userId: string, @Body() data: CommentDTO): Promise<IdeaRO> {
        return this.ideaService.comment(id, userId, data);
    }

    @Get(':id/comments')
    getComments(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.getIdeaWithComment(id);
    }
}
