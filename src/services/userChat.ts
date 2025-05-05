import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Ollama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export const handleUserChat = async (inputText: string, docName: string) => {
  // 1. Initialize embedding model
  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
  });

  // 2. Connect to Qdrant
  const client = new QdrantClient({
    url: "http://localhost:6333",
  });

  // 3. Load from existing vector store
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      client,
      collectionName: docName,
    }
  );

  // 4. Create retriever (top K similar documents)
  const retriever = vectorStore.asRetriever(2); // adjust k=5 for top 5 similar chunks , 2 : top 2
  console.log(retriever, "retriever");

  // 5. Use retriever to get relevant chunks
  const docs = await retriever.invoke(inputText);
  console.log(docs, "docs");

  // If no documents are found, return fallback respose
  if (docs.length === 0) {
    return {
      answer:
        "I'm sorry, I couldn't find any relevant information in the provided document.",
      references: [],
    };
  }

  // 6. Prepare context string
  const context = docs.map((doc: any) => doc.pageContent).join("\n\n");

  // 7. Prompt template
  const prompt = `You are a my ownassistant. Use the following context to answer the question.
        Context:
        ${context}
        Question:
        ${inputText}
        Answer:`;

  // 5. Ollama as LLM
  const llm = new Ollama({
    model: "llama3", // Default value
    temperature: 0,
    baseUrl: "http://localhost:11434",
    maxRetries: 2,
    // other params...
  });

  const chain = RunnableSequence.from([llm, new StringOutputParser()]);
  const answer = await chain.invoke(prompt);

  return {
    answer,
    references: docs,
  };
};
