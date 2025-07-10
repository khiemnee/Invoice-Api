import { AppDataSource } from "../database/data-source";
import { Invoice } from "../entity/Invoice";
import { InvoiceItem } from "../entity/InvoiceItem";
import { invoiceStatus } from "../database/enums/invoiceStatus";
import { LessThan } from "typeorm";
import { sendEmailInvoiceJob } from "../jobs/email.job";
import { Client } from "../entity/Client";

const invoiceItemsRepository = AppDataSource.getRepository(InvoiceItem);
const invoiceRepository = AppDataSource.getRepository(Invoice);
const clientRepository = AppDataSource.getRepository(Client)

type RawItem = {
  name: string;
  quantity: number;
  price: number;
};

export const convertItems = async (items: RawItem[]) => {
  const convertedItems = items.map((values) =>
    invoiceItemsRepository.create({
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    })
  );
  await invoiceItemsRepository.save(convertedItems);
  return convertedItems;
};

export const totalAmount = (items: RawItem[]) => {
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return totalAmount;
};

export const updateOverDueInvoice = async () => {
  const today = new Date();

  const overDueInvoices = await invoiceRepository.find({
    where: {
      status: invoiceStatus.PENDING,
      dueDate: LessThan(today),
    },
  });


 for (const invoice of overDueInvoices ){
    invoice.status = invoiceStatus.OVERDUE
    await invoiceRepository.save(invoice)
 }

   console.log(`[Cron] Updated ${overDueInvoices.length} overdue invoices`);
};

export const reminderSendEmail = async () =>{
  const pendingInvoices = await invoiceRepository.find({
    where : {
      status : invoiceStatus.UNPAID
    },
    relations : ['client','items']
  })

  for (const invoice of pendingInvoices){
    const client = await clientRepository.findOneBy({
      id : invoice.client.id
    })
    await sendEmailInvoiceJob(invoice,client)
  }

  console.log(`[Cron] pushing reminder ${pendingInvoices.length} email to queue  `);
}