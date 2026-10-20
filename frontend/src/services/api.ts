
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface StudyDocument {
  documentId: string;
  filename: string;
  pageCount: number;
  chunkCount: number;
  uploadedAt: string;
}

export interface ChatSource {
  filename?: string;
  content?: string;
  text?: string;
  page?: number;
}

export interface ChatResponse {
  success?: boolean;
  answer?: string;
  response?: string;
  sources?: ChatSource[];
  message?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data as T;
}

export async function fetchDocuments(): Promise<StudyDocument[]> {
  const response = await fetch(`${API_BASE_URL}/api/documents`);
  const data = await handleResponse<{
    documents?: StudyDocument[];
    data?: StudyDocument[];
  }>(response);

  if (Array.isArray(data.documents)) return data.documents;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/documents/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  return handleResponse<Record<string, unknown>>(response);
}

export async function sendChatMessage(message: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return handleResponse<ChatResponse>(response);
}
