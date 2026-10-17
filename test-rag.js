import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";
import Groq from "groq-sdk";

// Step 1 — Load PDF
const loader = new PDFLoader("test.pdf")
const docs = await loader.load()
console.log(`Loaded ${docs.length} pages`)

// Step 2 — Split into chunks
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50
})
const chunks = await splitter.splitDocuments(docs)
console.log(`Split into ${chunks.length} chunks`)

// Step 3 — Store in ChromaDB

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

const embeddingFunction = new DefaultEmbeddingFunction();

const collection = await client.getOrCreateCollection({
  name: "studymate_test",
  embeddingFunction,
});

// Store or update all 8 chunks
await collection.upsert({
  ids: chunks.map((_, i) => `chunk_${i}`),
  documents: chunks.map((c) => c.pageContent),
  metadatas: chunks.map((c) => ({
    page: Number(c.metadata.page ?? 0),
  })),
});

console.log("Chunks stored:", await collection.count());


// Step 4 — Search

 // Step 4 — Search
const question = "What is devops ?";

const results = await collection.query({
  queryTexts: [question],
  nResults: 3,
  include: ["documents", "metadatas", "distances"]
});

console.log("Retrieved results:", JSON.stringify(results, null, 2));

const retrievedDocs = results.documents?.[0] ?? [];
const context = retrievedDocs.filter(Boolean).join("\n\n");

console.log("Retrieved document count:", retrievedDocs.length);
console.log("Context length:", context.length);
console.log("Retrieved context:", context.slice(0, 1000));


// Step 5 — Generate answer
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-120b",
  messages: [
    {
      role: "system",
      content: "Answer questions based only on the provided context."
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion: ${question}`
    }
  ]
})

console.log("Answer:", response.choices[0].message.content)