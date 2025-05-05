import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { processAndStorePDF } from "../rag/embeddAndStore";

const connection = new Redis({
  host: "localhost", // or your Valkey host
  port: 6379, // default port for Valkey
  maxRetriesPerRequest: null,
});

/**
 * Now inside worker we have process the few things.
 * 1. Read the pdf file from uploads folder i.e : data.pdfPath
 * 2. Process the pdf file and convert it into the chunks
 * 3. Use the openAI embedding model to embed the chunks
 * 4. Store the embeddings in the Quadrant database
 */

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    console.log(job.data);
    const { pdfPath, originalNameWithoutExt } = job.data;
    await processAndStorePDF(pdfPath, originalNameWithoutExt);
    console.log("PDF processed and stored in Qdrant");
  },
  { connection }
);
