import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaDTO, IdeaRO } from './dto/idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
    ) {}

    async findAllIdeas(): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find();

        return ideas.map(idea => idea.toResponseObject());
    }

    async getIdeaByid(id: string): Promise<IdeaEntity> {
        const idea = await this.ideaRepository.findOne(id);

        if (!idea) {
            throw new HttpException('Idea not found', HttpStatus.NOT_FOUND);
        }

        return idea;
    }

    async createIdea(data: IdeaDTO): Promise<IdeaRO> {
        const idea = this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);

        return idea.toResponseObject();
    }

    async showIdea(id: string): Promise<IdeaRO> {
        const idea = await this.getIdeaByid(id);

        return idea.toResponseObject();
    }

    async updateIdea(id: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
        const idea = await this.getIdeaByid(id);
        await this.ideaRepository.save({...idea, ...data});

        const updatedIdea = await this.getIdeaByid(id);

        return updatedIdea.toResponseObject();
    }

    async deleteIdea(id: string): Promise<IdeaRO> {
        const idea = await this.getIdeaByid(id);
        await this.ideaRepository.delete(id);

        return idea.toResponseObject();
    }
}
