# 🧠 LocalMind – Private, Local RAG-based Semantic Chat

**LocalMind** is a fully local, privacy-focused semantic chat system built using Retrieval-Augmented Generation (RAG). It enables intelligent Q&A over your documents (e.g., PDFs) with zero external API usage, no internet dependency, and full data control.

---

## ⚙️ Tech Stack

### Backend
- **Node.js & Express** – Handles routes, ingestion, and API logic.

### Queue Management
- **BullMQ** – Manages background jobs (e.g., document ingestion and processing).

### Vector Store
- **Qdrant** (via Docker) – High-performance vector database to store and search text embeddings.

### Embeddings
- **Xenova/all-MiniLM-L6-v2** via HuggingFace Transformers.js
  - Runs entirely **locally** in Node.js or browser using **WebAssembly**.
  - No API calls or internet required.
  - Zero usage cost.

### LLM for Responses
- **Ollama** with **Llama 3**
  - Transformer-based language model running **offline** on your local system.
  - No API charges or cloud reliance.

### In-Memory Store
- **Valkey** – Open-source fork of Redis
  - BSD-3 Clause license
  - Maintained by the Linux Foundation

### Containerized Infrastructure
- **Docker Compose**
  - Manages services like Qdrant and Valkey for local development.

---

## 🔍 What It Does

1. **Document Upload**: Accepts PDFs or text documents from users.
2. **Text Chunking**: Splits documents into manageable chunks.
3. **Embedding Generation**: Uses local MiniLM model to generate vector representations.
4. **Vector Storage**: Stores embeddings in Qdrant for similarity search.
5. **Semantic Search**: On user query, retrieves relevant chunks using vector similarity.
6. **LLM Response**: Feeds context to **Llama 3 via Ollama** to generate natural language answers.

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/localmind.git
cd localmind
