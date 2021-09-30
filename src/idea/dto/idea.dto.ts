import { IsString } from "class-validator";
import { UserRO } from "src/user/dto/user.dto";

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
    author?: UserRO;
}