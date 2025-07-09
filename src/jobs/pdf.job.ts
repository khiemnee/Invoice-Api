import { Queue, QueueEvents } from "bullmq";
import connection from "../services/redis.service";
import { Invoice } from "../entity/Invoice";

const pdfQueue = new Queue("pdf-queue", { connection });
const pdfQueueEvents = new QueueEvents("pdf-queue");

export const viewInvoicePdfQueue = async (invoice: Invoice) => {
  const job = await pdfQueue.add("generate", invoice);
  const result = await job.waitUntilFinished(pdfQueueEvents);
  const buffer = Buffer.from(result, "base64");

  return buffer;
};
