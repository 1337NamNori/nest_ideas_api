import { CommentEntity } from 'src/comment/comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IdeaRO } from './dto/idea.dto';

@Entity('ideas')
export class IdeaEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('varchar')
    idea: string;

    @Column('text')
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserEntity, author => author.ideas)
    author: UserEntity;

    @ManyToMany(() => UserEntity, {cascade: true})
    @JoinTable({
        name: 'upvotes',
        joinColumn: {
            name: 'ideaId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    })
    upvotes: UserEntity[];

    @ManyToMany(() => UserEntity, {cascade: true})
    @JoinTable({
        name: 'downvotes',
        joinColumn: {
            name: 'ideaId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    })
    downvotes: UserEntity[];

    @OneToMany(() => CommentEntity, comment => comment.idea)
    comments: CommentEntity[];

    toResponseObject(): IdeaRO {
        const responseObject: IdeaRO = {
            id: this.id,
            idea: this.idea,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        if (this.author) {
            responseObject.author = this.author.toResponseObject();
        }

        if (this.downvotes) {
            responseObject.downvotes = this.downvotes.map(user => user.toResponseObject());
        }

        if (this.upvotes) {
            responseObject.upvotes = this.upvotes.map(user => user.toResponseObject());
        }

        if (this.comments) {
            responseObject.comments = this.comments.map(comment => comment.toResponseObject());
        }

        return responseObject;
    }
}
