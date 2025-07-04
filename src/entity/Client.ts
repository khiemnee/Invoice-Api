import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 255,
  })
  name: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column()
  address: string;
  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];

  @Column()
  phone: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
