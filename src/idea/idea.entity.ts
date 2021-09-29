import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IdeaRO } from './dto/idea.dto';

@Entity('ideas')
export class IdeaEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('varchar')
    idea: string;

    @Column('varchar')
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toResponseObject(): IdeaRO {
        const responseObject: IdeaRO = {
            id: this.id,
            idea: this.idea,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }

        return responseObject;
    }
}
