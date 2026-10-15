import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { ChromaClient } from "chromadb"
import Groq from "groq-sdk"
import * as fs from "fs"

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
const client = new ChromaClient({ path: "http://localhost:8000" })
const collection = await client.createCollection({ name: "studymate" })

await collection.add({
  ids: chunks.map((_, i) => `chunk_${i}`),
  documents: chunks.map(c => c.pageContent),
  metadatas: chunks.map(c => ({ page: c.metadata.page }))
})
console.log("Stored in ChromaDB")

// Step 4 — Search
const question = "What is backpropagation?"
const results = await collection.query({
  queryTexts: [question],
  nResults: 3
})
const context = results.documents[0].join("\n\n")
console.log("Retrieved context:", context.slice(0, 200))

// Step 5 — Generate answer
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const response = await groq.chat.completions.create({
  model: "llama3-8b-8192",
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