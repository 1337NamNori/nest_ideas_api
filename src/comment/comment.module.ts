import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, IdeaEntity, UserEntity])],
    controllers: [CommentController],
    providers: [CommentService, UserService],
})
export class CommentModule {}
