import { Queue } from "bullmq";
import connection from "../services/redis.service";
import { Invoice } from "../entity/Invoice";
import { Client } from "../entity/Client";



const emailQueue = new Queue("email-queue", {
  connection
});


export const sendEmailInvoiceJob = async (invoice :Invoice,client:Client) =>{
 await emailQueue.add('send-email-invoice',{invoice,client})
}