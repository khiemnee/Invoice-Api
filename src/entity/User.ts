import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Invoice } from "./Invoice";
import {IsEmail,Length} from 'class-validator'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    nullable : true
  })
  @Length(8,16)
  name?: string;

  @OneToMany(() => Invoice,invoice =>invoice.user )
  invoices  : Invoice[]

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
