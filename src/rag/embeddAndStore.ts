import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";

/**
 * Process PDF: load, chunk, embed (locally), store in Qdrant
 */

export async function processAndStorePDF(filePath: string, docName: string) {
  console.log(`Processing the PDF : ${filePath}`);
  console.log(docName, "docName");

  // 1. Load the PDF and extract pages from it.
  const loader = new PDFLoader(filePath);
  const pages = await loader.load();
  console.log(`Loaded ${pages.length} documents`);

  // Ensure pages have text content
  const textContent = pages.map((page) => page.pageContent);
  if (!textContent || textContent.length === 0) {
    throw new Error("No text content found in the PDF.");
  }

  // 2. Chunk the pages into smaller chunks -- To help retrieval accuracy.
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(pages);
  console.log(` Splitted into ${chunks.length} chunks `);

  // 3.Load local HuggingFace embedding models
  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
  });
  console.log("Loading and initializing embedding model ...");

  // 4. Connect to the Qdrant local server
  const client = new QdrantClient({
    url: "http://localhost:6333",
    timeout: 60000,
  });

  // 5. Store the embeddings in Qdrant
  /*
    The fromDocuments() method will internally handle the chunk embeddings by calling the embedding model you pass (in this case,         HuggingFaceTransformersEmbeddings).
    It expects the chunks to have a pageContent field, which will be used to generate embeddings for each chunk.
    You don't need to manually embed each chunk because QdrantVectorStore.fromDocuments() will handle the embedding process for us.
   */

  try {
    const vectorStore = await QdrantVectorStore.fromDocuments(
      chunks,
      embeddings,
      {
        client,
        collectionName: docName,
      }
    );
    console.log(`Embedded and stored in Qdrant`);
    return vectorStore;
  } catch (error) {
    console.error("Error while embedding/storing in Qdrant:", error);
  }
}
