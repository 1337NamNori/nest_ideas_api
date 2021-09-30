import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UsePipes,
} from '@nestjs/common';
import { IdeaDTO, IdeaRO } from './dto/idea.dto';
import { IdeaService } from './idea.service';
import {ValidationPipe} from '../shared/validation.pipe';

@Controller('api/ideas')
export class IdeaController {
    constructor(private ideaService: IdeaService) {}

    @Get()
    findAll(): Promise<IdeaRO[]> {
        return this.ideaService.findAllIdeas();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() data: IdeaDTO): Promise<IdeaRO> {
        return this.ideaService.createIdea(data);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.showIdea(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.updateIdea(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.deleteIdea(id);
    }
}
