import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { IdeaController } from './idea.controller';
import { IdeaEntity } from './idea.entity';
import { IdeaService } from './idea.service';

@Module({
    imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
    controllers: [IdeaController],
    providers: [IdeaService, UserService],
})
export class IdeaModule {}
