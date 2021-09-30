import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        private userService: UserService,
    ) {}

    async findAllIdeas(): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find();

        return ideas.map(idea => idea.toResponseObject());
    }

    async getIdeaByid(id: string, relations: string[] = ['author', 'upvotes', 'downvotes']): Promise<IdeaEntity> {
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
}
