import { IsString } from "class-validator";
import { IdeaRO } from "src/idea/dto/idea.dto";
import { UserRO } from "src/user/dto/user.dto";

export class CommentDTO {
    @IsString()
    text: string;
}

export interface CommentRO {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    user?: UserRO;
    idea?: IdeaRO;
}