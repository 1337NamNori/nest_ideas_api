import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentDTO } from 'src/comment/dto/comment.dto';
import { Pagination } from 'src/types/pagination.interface';
import {paginate} from 'src/helpers/pagination';
import { Repository } from 'typeorm';
import { Votes } from '../types/votes.enum';
import { UserRO } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { IdeaDTO, IdeaRO } from './dto/idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity) 
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        private userService: UserService,
    ) {}

    private relations = [
        'author', 
        'upvotes',
        'downvotes',
        'comments',
    ]

    async findAllIdeas(route: string, page: number): Promise<Pagination<IdeaRO>> {
        return await paginate<IdeaRO, IdeaEntity>(this.ideaRepository, route, this.relations, page);
    }

    async getIdeaByid(id: string, relations: string[] = this.relations): Promise<IdeaEntity> {
        const idea = await this.ideaRepository.findOne(id, {relations});

        if (!idea) {
            throw new HttpException('Idea not found', HttpStatus.NOT_FOUND);
        }

        return idea;
    }

    ensureOwnership(user: UserEntity, idea: IdeaEntity) {
        if (user.id !== idea.author.id) {
            throw new HttpException('This action is forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async createIdea(data: IdeaDTO, userId: string): Promise<IdeaRO> {
        const user = await this.userService.getUserById(userId);
        const idea = this.ideaRepository.create({...data, author: user});
        await this.ideaRepository.save(idea);

        return idea.toResponseObject();
    }

    async showIdea(id: string): Promise<IdeaRO> {
        const idea = await this.getIdeaByid(id);

        return idea.toResponseObject();
    }

    async updateIdea(id: string, data: Partial<IdeaDTO>, userId: string): Promise<IdeaRO> {
        const user = await this.userService.getUserById(userId);
        const idea = await this.getIdeaByid(id);
        this.ensureOwnership(user, idea);

        await this.ideaRepository.save({...idea, ...data});
        const updatedIdea = await this.getIdeaByid(id);

        return updatedIdea.toResponseObject();
    }

    async deleteIdea(id: string, userId: string): Promise<IdeaRO> {
        const user = await this.userService.getUserById(userId);
        const idea = await this.getIdeaByid(id);
        this.ensureOwnership(user, idea);

        await this.ideaRepository.delete(id);

        return idea.toResponseObject();
    }

    async bookmarks(id: string, userId: string): Promise<UserRO> {
        const user = await this.userService.getUserById(userId, ['bookmarks', 'bookmarks.author']);
        const idea = await this.getIdeaByid(id);

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
        } else {
            user.bookmarks.push(idea);
        }

        await this.userRepository.save(user);

        return user.toResponseObject();
    }

    async votes(ideaId: string, userId: string, vote: Votes): Promise<IdeaRO> {
        const user = await this.userService.getUserById(userId);
        const idea = await this.getIdeaByid(ideaId);

        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;

        if (idea[vote].filter(item => item.id === userId).length === 0) {
            idea[opposite] = idea[opposite].filter(item => item.id !== userId);
            idea[vote].push(user);
        } else {
            idea[vote] = idea[vote].filter(item => item.id !== userId);
        }

        await this.ideaRepository.save(idea);

        return idea.toResponseObject();
    }

    upvotes(id: string, userId: string): Promise<IdeaRO> {
        return this.votes(id, userId, Votes.UP);
    }

    downvotes(id: string, userId: string): Promise<IdeaRO> {
        return this.votes(id, userId, Votes.DOWN);
    }

    async comment(id: string, userId: string, data: CommentDTO): Promise<IdeaRO> {
        const idea = await this.getIdeaByid(id, ['comments', 'comments.user']);
        const user = await this.userService.getUserById(userId);

        const comment = this.commentRepository.create({...data, user, idea });
        await this.commentRepository.save(comment);

        const newIdea = await this.getIdeaByid(id, ['comments', 'comments.user']);
        

        return newIdea.toResponseObject();
    }

    async getIdeaWithComment(id: string): Promise<IdeaRO> {
        const idea = await this.getIdeaByid(id, ['comments', 'comments.user']);

        return idea.toResponseObject();
    }
}
