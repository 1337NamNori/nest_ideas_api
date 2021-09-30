import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/shared/user.decorator';
import { ValidationPipe } from '../shared/validation.pipe';
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
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    create(@User('id') userId: string, @Body() data: IdeaDTO): Promise<IdeaRO> {
        return this.ideaService.createIdea(data, userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<IdeaRO> {
        return this.ideaService.showIdea(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @User('id') userId: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.updateIdea(id, data, userId);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    remove(@Param('id') id: string, @User('id') userId: string): Promise<IdeaRO> {
        return this.ideaService.deleteIdea(id, userId);
    }
}
