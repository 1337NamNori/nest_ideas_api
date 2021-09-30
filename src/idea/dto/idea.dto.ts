import { IsString } from "class-validator";
import { CommentRO } from "src/comment/dto/comment.dto";
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
    upvotes?: UserRO[];
    downvotes?: UserRO[];
    comments?: CommentRO[];
}