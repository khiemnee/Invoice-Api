import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import connection from "../services/redis.service";

const worker = new Worker(
  "email-queue",
  async (job) => {

    const {invoice,client} = job.data

    await sendEmail(invoice,client);
  },
  { connection }
);

worker.on("completed", () => {
  console.log(`✅ Sent invoice email completed`);
});

worker.on("failed", (job,err) => {
  console.error(`❌ Failed to send invoice email:`, err);
});
