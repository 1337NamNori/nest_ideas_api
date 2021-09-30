import { IsString } from "class-validator";

export class IdeaDTO {
    @IsString()
    idea: string;

    @IsString()
    description: string;
}

export interface IdeaRO {
    id: string;
    idea: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}