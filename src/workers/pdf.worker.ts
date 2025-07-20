import { Worker } from "bullmq";
import { generateInvoicePDF } from "../services/pdf.service";
import connection from "../services/redis.service";


const worker = new Worker(
  "pdf-queue",
  async (job) => {
   const pdfBuffer = await generateInvoicePDF(job.data);
   const base64 = Buffer.from(pdfBuffer).toString('base64');

   return base64
  },
  { connection }
);

worker.on('completed',()=>{
    console.log('pdf load sucessfull')
})

worker.on('failed',(job,err)=>{
    console.log(err)
})