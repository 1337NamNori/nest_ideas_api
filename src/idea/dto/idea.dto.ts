export class IdeaDTO {
    idea: string;
    description: string;
}

export interface IdeaRO {
    id: string;
    idea: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}