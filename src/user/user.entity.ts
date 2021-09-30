import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './dto/user.dto';
import { IdeaEntity } from 'src/idea/idea.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    username: string;

    @Column('varchar')
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => IdeaEntity, (idea) => idea.author)
    ideas: IdeaEntity[];

    @ManyToMany(() => IdeaEntity, { cascade: true })
    @JoinTable({
        name: 'bookmarks',
        joinColumn: {
            name: "userId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "ideaId",
            referencedColumnName: "id"
        } 
    })
    bookmarks: IdeaEntity[];

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    toResponseObject(showToken = false): UserRO {
        const responseObject: UserRO = {
            id: this.id,
            username: this.username,
            createdAt: this.createdAt,
        };

        if (showToken) {
            responseObject.token = this.token;
        }

        if (this.ideas) {
            responseObject.ideas = this.ideas.map((idea) =>
                idea.toResponseObject(),
            );
        }

        if (this.bookmarks) {
            responseObject.bookmarks = this.bookmarks.map((bookmark) =>
                bookmark.toResponseObject(),
            );
        }

        return responseObject;
    }

    async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    private get token(): string {
        const { id, username } = this;
        return jwt.sign({ id, username }, process.env.SECRET, {
            expiresIn: '7d',
        });
    }
}
