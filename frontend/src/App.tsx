
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  FileText,
  GraduationCap,
  LoaderCircle,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import {
  fetchDocuments,
  sendChatMessage,
  uploadDocument,
  type StudyDocument,
  type ChatSource,
} from "./services/api";
import "./App.css";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

function App() {
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm StudyMate, your AI study assistant. Upload your study material and ask me questions about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);

  async function loadDocuments() {
    try {
      const result = await fetchDocuments();
      setDocuments(result);
      setError("");
    } catch {
      setError(
        "Couldn't load documents. Check that the backend and ChromaDB are running.",
      );
    } finally {
      setLoadingDocuments(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleUpload(file?: File) {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      await uploadDocument(file);
      await loadDocuments();
      setNotice(`${file.name} uploaded successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Document upload failed.",
      );
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleSend(text = input) {
    const question = text.trim();
    if (!question || sending) return;

    setMessages((previous) => [
      ...previous,
      { id: Date.now(), role: "user", content: question },
    ]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const result = await sendChatMessage(question);
      const answer =
        result.answer ??
        result.response ??
        result.message ??
        "I couldn't find an answer in the response.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: answer,
          sources: result.sources,
        },
      ]);
    } catch (err) {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I couldn't reach the backend. Please check that the API is running and try again.",
        },
      ]);
      setError(err instanceof Error ? err.message : "Chat request failed.");
    } finally {
      setSending(false);
    }
  }

  const suggestions = [
    "Summarize my study material",
    "Explain the key concepts",
    "Create revision questions",
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="StudyMate home">
          <span className="brand-icon"><GraduationCap size={25} /></span>
          <span>StudyMate<span className="brand-dot">.</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <button className="nav-item active">
          <MessageSquare size={18} /> AI Study Chat
        </button>
        <button
          className="nav-item"
          onClick={() => fileInput.current?.click()}
        >
          <BookOpen size={18} /> My Library
        </button>

        <div className="sidebar-section">
          <div className="section-heading">
            <span>YOUR DOCUMENTS</span>
            <button
              className="icon-button"
              title="Upload document"
              onClick={() => fileInput.current?.click()}
            >
              <Plus size={17} />
            </button>
          </div>

          <div className="sidebar-documents">
            {loadingDocuments ? (
              <p className="muted small">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="muted small">Your library is empty.</p>
            ) : (
              documents.map((doc) => (
                <div className="document-nav" key={doc.documentId}>
                  <FileText size={17} />
                  <span title={doc.filename}>{doc.filename}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar"><UserRound size={19} /></div>
          <div className="profile-copy">
            <strong>My Study Space</strong>
            <span>Personal workspace</span>
          </div>
          <span className="online-dot" />
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Workspace <span>/</span> AI Study Chat</div>
            <h1>AI Study Assistant</h1>
          </div>
          <div className="topbar-status">
            <span className="status-dot" /> Ready to help
          </div>
        </header>

        <section className="dashboard">
          <div className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL LEARNING SPACE</div>
              <h2>Learn smarter, not harder.</h2>
              <p>Ask questions, understand concepts, and revise using your own study materials.</p>
            </div>
            <div className="welcome-illustration"><GraduationCap size={48} /></div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple"><FileText size={20} /></div>
              <div><span>Uploaded documents</span><strong>{documents.length}</strong></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><MessageSquare size={20} /></div>
              <div><span>Questions asked</span><strong>{Math.max(0, Math.floor((messages.length - 1) / 2))}</strong></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><CheckCircle2 size={20} /></div>
              <div><span>Study assistant</span><strong className="ready-text">Ready</strong></div>
            </div>
          </div>

          <div className="content-grid">
            <section className="chat-card">
              <div className="card-header">
                <div className="chat-heading-icon"><Bot size={21} /></div>
                <div>
                  <h3>Chat with your materials</h3>
                  <p>Answers grounded in your uploaded documents</p>
                </div>
                <span className="ai-pill"><span /> AI ACTIVE</span>
              </div>

              <div className="chat-messages">
                {messages.map((message) => (
                  <div className={`message-row ${message.role}`} key={message.id}>
                    <div className={`message-avatar ${message.role}`}>
                      {message.role === "assistant" ? <Bot size={18} /> : <UserRound size={17} />}
                    </div>
                    <div className="message-body">
                      <div className="message-author">
                        {message.role === "assistant" ? "StudyMate" : "You"}
                      </div>
                      <div className={`message-bubble ${message.role}`}>
                        {message.content}
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="sources">
                          <strong>Sources</strong>
                          {message.sources.map((source, index) => (
                            <div className="source-item" key={`${source.filename}-${index}`}>
                              <FileText size={14} />
                              <span>{source.filename || "Study material"}</span>
                              {source.page != null && <span>Page {source.page}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="message-row assistant">
                    <div className="message-avatar assistant"><Bot size={18} /></div>
                    <div className="message-body">
                      <div className="message-author">StudyMate</div>
                      <div className="message-bubble assistant typing">
                        <LoaderCircle size={16} className="spin" /> Thinking through your question...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEnd} />
              </div>

              {messages.length === 1 && (
                <div className="suggestion-area">
                  <span>TRY ASKING</span>
                  <div className="suggestion-list">
                    {suggestions.map((suggestion) => (
                      <button key={suggestion} onClick={() => void handleSend(suggestion)}>
                        {suggestion}<span>↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className="inline-error"><X size={15} /> {error}</div>}
              {notice && <div className="inline-success"><CheckCircle2 size={15} /> {notice}</div>}

              <form
                className="chat-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSend();
                }}
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Ask anything about your study materials..."
                  rows={2}
                  disabled={sending}
                />
                <div className="composer-footer">
                  <span><Paperclip size={15} /> Answers based on your documents</span>
                  <button type="submit" className="send-button" disabled={!input.trim() || sending}>
                    {sending ? <LoaderCircle size={17} className="spin" /> : <Send size={17} />}
                    Send
                  </button>
                </div>
              </form>
            </section>

            <aside className="right-column">
              <section className="upload-card">
                <div className="right-card-heading">
                  <div><UploadCloud size={20} /></div>
                  <div><h3>Study materials</h3><p>Upload a PDF to get started</p></div>
                </div>

                <button
                  className={`dropzone ${uploading ? "uploading" : ""}`}
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <LoaderCircle size={29} className="spin" /> : <UploadCloud size={29} />}
                  <strong>{uploading ? "Uploading document..." : "Click to upload"}</strong>
                  <span>PDF files only</span>
                  <small>Choose a file from your computer</small>
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={(event) => void handleUpload(event.target.files?.[0])}
                />

                <div className="upload-note">
                  <CheckCircle2 size={16} />
                  <span>Your materials are used to provide relevant, document-based answers.</span>
                </div>
              </section>

              <section className="library-card">
                <div className="library-heading">
                  <div><h3>Your library</h3><p>{documents.length} document{documents.length === 1 ? "" : "s"} available</p></div>
                  <FileText size={19} />
                </div>

                {loadingDocuments ? (
                  <p className="muted small">Loading your library...</p>
                ) : documents.length === 0 ? (
                  <div className="empty-library">
                    <div><FileText size={23} /></div>
                    <strong>No documents yet</strong>
                    <span>Upload your first PDF to begin.</span>
                  </div>
                ) : (
                  <div className="library-list">
                    {documents.map((doc) => (
                      <div className="library-document" key={doc.documentId}>
                        <div className="pdf-icon"><FileText size={20} /></div>
                        <div className="library-document-info">
                          <strong title={doc.filename}>{doc.filename}</strong>
                          <span>{doc.pageCount} pages · {doc.chunkCount} chunks</span>
                        </div>
                        <CheckCircle2 size={17} className="document-check" />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </aside>
          </div>

          <footer className="dashboard-footer">
            <span>StudyMate · Your learning companion</span>
            <span><span className="status-dot" /> Connected to your study workspace</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
