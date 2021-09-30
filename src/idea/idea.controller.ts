import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { CommentDTO } from 'src/comment/dto/comment.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/shared/user.decorator';
import { UserRO } from 'src/user/dto/user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { IdeaDTO, IdeaRO } from './dto/idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {
    constructor(private ideaService: IdeaService) {}

    @Get()
    findAll(): Promise<IdeaRO[]> {
        return this.ideaService.findAllIdeas();
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
