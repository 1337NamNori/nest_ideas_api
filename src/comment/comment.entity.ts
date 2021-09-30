import { IdeaEntity } from "src/idea/idea.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentRO } from "./dto/comment.dto";

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('text')
    text: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => IdeaEntity, idea => idea.comments)
    idea: IdeaEntity;

    @ManyToOne(() => UserEntity, user => user.comments)
    user: UserEntity;

    toResponseObject(): CommentRO {
        const responseObject: CommentRO = {
            id: this.id,
            text: this.text,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        if (this.idea) {
            responseObject.idea = this.idea.toResponseObject();
        }

        if (this.user) {
            responseObject.user = this.user.toResponseObject();
        }

        return responseObject;
    }
}