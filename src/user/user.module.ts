import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/comment.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, IdeaEntity, CommentEntity])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
