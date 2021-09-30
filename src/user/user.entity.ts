import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}