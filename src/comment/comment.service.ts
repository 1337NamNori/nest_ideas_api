import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentDTO, CommentRO } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        private userService: UserService
    ) {}
    

    async getCommentById(id: string, relations: string[] = ['user', 'idea']): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne(id, {relations});

        if (!comment) {
            throw new HttpException('Comment Not Found', HttpStatus.NOT_FOUND);
        }

        return comment;
    }

    private ensureOwnership(comment: CommentEntity, user: UserEntity) {
        if (comment.user.id !== user.id) {
            throw new HttpException('This action is forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async findOne(id: string) : Promise<CommentRO> {
        const comment = await this.getCommentById(id);

        return comment.toResponseObject();
    }

    async updateComment(id: string, userId: string, data: CommentDTO): Promise<CommentRO> {
        const comment = await this.getCommentById(id);
        const user = await this.userService.getUserById(userId);
        this.ensureOwnership(comment, user);

        await this.commentRepository.save({...comment, ...data});
        const newComment = await this.getCommentById(id);

        return newComment.toResponseObject();
    }

    async deleteComment(id: string, userId: string): Promise<CommentRO> {
        const comment = await this.getCommentById(id);
        const user = await this.userService.getUserById(userId);
        this.ensureOwnership(comment, user);

        await this.commentRepository.delete(id);

        return comment.toResponseObject();
    }
}
