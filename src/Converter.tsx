import { DragEvent, useRef, useState } from 'react'
import { convertDocument } from './lib/converter'

const DEFAULT_ACCEPTED_EXTENSIONS = [
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

const DEFAULT_FORMATS = 'DOCX · PPTX · XLSX · PDF · EPUB · CSV · ODT · ODS · ODP · RTF'

type ConverterProps = {
  accept?: string
  formats?: string
  dropLabel?: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function markdownFileName(name: string) {
  const stem = name.replace(/\.[^.]+$/, '') || 'document'
  return `${stem}.md`
}

function acceptsFile(file: File, accept: string) {
  const extensions = accept
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (extensions.length === 0) return true
  return extensions.some((extension) => file.name.toLowerCase().endsWith(extension))
}

function Converter({
  accept = DEFAULT_ACCEPTED_EXTENSIONS,
  formats = DEFAULT_FORMATS,
  dropLabel = 'Drop a document here',
}: ConverterProps) {
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
    setCopied(false)

    if (!acceptsFile(nextFile, accept)) {
      setError(`Choose a supported file: ${formats}.`)
      return
    }

    setError('')
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
        <h2>{converting ? 'Converting document…' : dropLabel}</h2>
        <p>or choose a file from your device</p>
        <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
          Choose file
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept={accept}
          onChange={(event) => {
            const nextFile = event.target.files?.[0]
            if (nextFile) void processFile(nextFile)
            event.currentTarget.value = ''
          }}
        />
        <p className="formats">{formats}</p>
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
  )
}

export default Converter
