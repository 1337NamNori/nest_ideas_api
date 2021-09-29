import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
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
    create(@Body() data: IdeaDTO): Promise<IdeaRO> {
        return this.ideaService.createIdea(data);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.showIdea(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: IdeaDTO) {
        return this.ideaService.updateIdea(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.deleteIdea(id);
    }
}
