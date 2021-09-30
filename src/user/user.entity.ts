import { BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRO } from "./dto/user.dto";

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

    @BeforeUpdate()
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

        return responseObject;
    }

    async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    private get token(): string {
        const {id, username} = this;
        return jwt.sign({id, username}, process.env.SECRET, {expiresIn: '7d'});
    }
}