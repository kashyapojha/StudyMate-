import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <h1>StudyMate</h1>
        <p>Your personal AI study assistant</p>
      </header>

      <main className="main">
        <section className="welcome-card">
          <h2>Learn smarter, not harder.</h2>
          <p>
            Upload your study materials and ask questions.
            StudyMate will help you understand your documents.
          </p>
          <button onClick={() => setCount(count + 1)}>
            Get Started ({count})
          </button>
        </section>

        <section className="feature-grid">
          <article className="feature-card">
            <h3>📄 Upload Documents</h3>
            <p>Upload PDF files containing your study material.</p>
          </article>

          <article className="feature-card">
            <h3>📚 My Library</h3>
            <p>View your uploaded study documents.</p>
          </article>

          <article className="feature-card">
            <h3>🤖 AI Study Chat</h3>
            <p>Ask questions and learn from your PDFs.</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App