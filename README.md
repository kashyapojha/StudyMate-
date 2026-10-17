# StudyMate — AI-Powered Study Assistant Using RAG

StudyMate is an AI-powered study assistant that uses **Retrieval-Augmented Generation (RAG)** to help students understand and learn from their study materials. It processes PDF documents, splits their content into smaller chunks, stores the information in a vector database, and retrieves relevant passages to answer user questions with context-aware responses.

## Key Features
- **PDF Processing:** Extract text from uploaded PDF documents.
- **Text Chunking:** Split document content into manageable chunks for efficient retrieval.
- **Semantic Search:** Retrieve relevant information using vector embeddings and ChromaDB.
- **AI-Powered Question Answering:** Use an LLM through the Groq API to generate answers based on retrieved document context.
- **Context-Aware Responses:** Ground answers in the provided study material to help reduce unsupported responses.

## Tech Stack
- **Backend:** Node.js, Express.js
- **AI & RAG:** LangChain.js, Groq API
- **Vector Database:** ChromaDB
- **Document Processing:** PDF parsing
- **Configuration:** Environment variables with dotenv

## How It Works
1. Load and extract text from a PDF.
2. Split the extracted text into smaller chunks.
3. Generate embeddings and store the chunks in ChromaDB.
4. Retrieve relevant chunks when a question is asked.
5. Pass the retrieved context and question to the LLM.
6. Generate an answer based on the available document context.

When a user uploads a PDF, the `PDFLoader` extracts its text, and `RecursiveCharacterTextSplitter` divides the text into smaller chunks of around 500 characters, with approximately 50 characters overlapping between consecutive chunks to preserve context. These chunks are then stored in ChromaDB along with unique IDs, metadata, and embeddings generated using the `DefaultEmbeddingFunction`. When the user asks a question, the embedding function converts the question into a numerical representation, and ChromaDB compares it with the stored chunk embeddings to retrieve the three most relevant chunks. My code then sends these retrieved chunks along with the user's question to the Groq API, which runs the LLM to generate an answer based on the provided context. Finally, the generated answer is returned to the user. This complete process is called Retrieval-Augmented Generation (RAG), as it combines information retrieval from a document with the text-generation capabilities of an LLM.

## Project Goal
To build a practical RAG-based learning assistant that helps students interact with their study materials through natural-language questions instead of manually searching through lengthy documents.
