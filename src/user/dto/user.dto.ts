import { IsString, Length } from "class-validator";

export class UserDTO {
    @IsString()
    username: string;

    @IsString()
    @Length(8)
    password: string;
}

export interface UserRO {
    id: string;
    username: string;
    createdAt: Date;
    token?: string;
}