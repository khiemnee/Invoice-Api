import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { InvoiceItem } from "./InvoiceItem";
import { invoiceStatus } from "../database/enums/invoiceStatus";

@Entity()
export class Invoice{
    @PrimaryGeneratedColumn()
    id : number
    @Column({
        type : 'float'
    })
    totalAmount : number
    @Column({
        type : 'timestamp'
    })
    dueDate : Date
    @Column({
        type : 'boolean',
        default : false
    })
    sent : boolean
   
    @ManyToOne(() =>User,(user) => user.invoices)
    user : User
    
    @Column({
        type : 'enum',
        enum : invoiceStatus,
        default : invoiceStatus.PENDING
    })
    status : invoiceStatus

    @OneToMany(()=>InvoiceItem,(invoiceItem)=>invoiceItem.invoice)
    items : InvoiceItem[]

    @ManyToOne(()=>Client,(client) => client.invoices)
    client : Client

   
    @CreateDateColumn()
    createdAt : Date
    @UpdateDateColumn()
    updatedAt : Date
}