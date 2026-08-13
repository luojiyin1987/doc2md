import { DragEvent, useRef, useState } from 'react'
import { convertDocument } from './lib/converter'

const ACCEPTED_EXTENSIONS = [
  '.doc',
  '.docx',
  '.docm',
  '.ppt',
  '.pptx',
  '.pptm',
  '.pps',
  '.ppsx',
  '.ppsm',
  '.pot',
  '.xls',
  '.xlsx',
  '.xlsm',
  '.xlsb',
  '.odt',
  '.ods',
  '.odp',
  '.rtf',
  '.epub',
  '.csv',
  '.pdf',
].join(',')

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function markdownFileName(name: string) {
  const stem = name.replace(/\.[^.]+$/, '') || 'document'
  return `${stem}.md`
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState('')
  const [converting, setConverting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)

  async function processFile(nextFile: File) {
    setFile(nextFile)
    setMarkdown('')
    setError('')
    setCopied(false)
    setConverting(true)

    try {
      const output = await convertDocument(nextFile)
      setMarkdown(output)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause)
      setError(message || 'Unable to convert this document.')
    } finally {
      setConverting(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)

    const nextFile = event.dataTransfer.files.item(0)
    if (nextFile) {
      void processFile(nextFile)
    }
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function downloadMarkdown() {
    if (!file || !markdown) return

    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = markdownFileName(file.name)
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="doc2md home">
          doc<span>2</span>md
        </a>
        <div className="privacy-pill">Browser-only conversion</div>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Private · fast · no upload</p>
          <h1>Any document to clean Markdown.</h1>
          <p className="hero-copy">
            Convert Word, PowerPoint, Excel, PDF, EPUB, CSV, and OpenDocument files locally in
            your browser. Your document never leaves your device.
          </p>
        </section>

        <section className="converter-card" aria-label="Document converter">
          <div
            className={`drop-zone${dragging ? ' is-dragging' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="file-icon" aria-hidden="true">
              MD
            </div>
            <h2>{converting ? 'Converting document…' : 'Drop a document here'}</h2>
            <p>or choose a file from your device</p>
            <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
              Choose file
            </button>
            <input
              ref={inputRef}
              className="visually-hidden"
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              onChange={(event) => {
                const nextFile = event.target.files?.[0]
                if (nextFile) void processFile(nextFile)
                event.currentTarget.value = ''
              }}
            />
            <p className="formats">
              DOCX · PPTX · XLSX · PDF · EPUB · CSV · ODT · ODS · ODP · RTF
            </p>
          </div>

          {file && (
            <div className="file-row">
              <div>
                <strong>{file.name}</strong>
                <span>{formatBytes(file.size)}</span>
              </div>
              <span className={error ? 'status status-error' : 'status'}>
                {converting ? 'Converting' : error ? 'Failed' : 'Ready'}
              </span>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              <strong>Could not convert this file.</strong>
              <span>{error}</span>
            </div>
          )}

          {markdown && (
            <div className="output-panel">
              <div className="output-header">
                <div>
                  <p className="eyebrow">Markdown output</p>
                  <h2>{markdownFileName(file?.name ?? 'document')}</h2>
                </div>
                <div className="output-actions">
                  <button type="button" className="secondary-button" onClick={() => void copyMarkdown()}>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button type="button" className="primary-button" onClick={downloadMarkdown}>
                    Download .md
                  </button>
                </div>
              </div>
              <textarea
                className="markdown-output"
                value={markdown}
                readOnly
                spellCheck={false}
                aria-label="Converted Markdown"
              />
            </div>
          )}
        </section>

        <section className="trust-grid" aria-label="Why doc2md">
          <article>
            <span>01</span>
            <h2>Local by default</h2>
            <p>Conversion runs in WebAssembly inside your browser. No document upload is required.</p>
          </article>
          <article>
            <span>02</span>
            <h2>One clean output</h2>
            <p>Mixed office formats are normalized into GitHub-Flavored Markdown for AI and text workflows.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Simple export</h2>
            <p>Inspect the Markdown, copy it to your clipboard, or download a ready-to-use .md file.</p>
          </article>
        </section>
      </main>

      <footer>
        <span>doc2md</span>
        <span>Powered by Firecrawl anydoc · MIT licensed</span>
      </footer>
    </div>
  )
}

export default App
