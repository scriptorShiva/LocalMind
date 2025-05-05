import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis({
  host: "localhost", // or your Valkey host
  port: 6379, // default port for Valkey
  maxRetriesPerRequest: null,
});

export const pdfQueue = new Queue("pdf-processing", { connection });
