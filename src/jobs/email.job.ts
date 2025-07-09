import { Queue } from "bullmq";
import connection from "../services/redis.service";
import { Invoice } from "../entity/Invoice";



const emailQueue = new Queue("email-queue", {
  connection
});


export const sendEmailInvoiceJob = async (invoice :Invoice) =>{
 await emailQueue.add('send-email-invoice',invoice)
}