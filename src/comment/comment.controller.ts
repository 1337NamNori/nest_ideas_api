import { Body, Controller, Delete, Get, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../shared/user.decorator';
import { ValidationPipe } from '../shared/validation.pipe';
import { CommentService } from './comment.service';
import { CommentDTO, CommentRO } from './dto/comment.dto';

@Controller('api/comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Get(':id')
    findOne(@Param('id') id: string): Promise<CommentRO> {
        return this.commentService.findOne(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @User('id') userId: string, @Body() data: CommentDTO): Promise<CommentRO> {
        return this.commentService.updateComment(id, userId, data);    
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    remove(@Param('id') id: string, @User('id') userId: string): Promise<CommentRO> {
        return this.commentService.deleteComment(id, userId);
    }
}
