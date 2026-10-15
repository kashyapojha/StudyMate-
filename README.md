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

## Project Goal
To build a practical RAG-based learning assistant that helps students interact with their study materials through natural-language questions instead of manually searching through lengthy documents.