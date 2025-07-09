// src/workers/email.worker.ts
import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import connection from "../services/redis.service";

const worker = new Worker(
  "email-queue",
  async (job) => {
    const { invoice } = job.data;

    await sendEmail(invoice);
  },
  { connection }
);

worker.on("completed", () => {
  console.log(`✅ Sent invoice email completed`);
});

worker.on("failed", (err) => {
  console.error(`❌ Failed to send invoice email:`, err);
});
