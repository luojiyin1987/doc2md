import Converter from './Converter'

function App() {
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

        <Converter />

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

        <section className="related-tools" aria-labelledby="format-tools-heading">
          <p className="eyebrow">Format-specific tools</p>
          <h2 id="format-tools-heading">Convert a specific document type</h2>
          <nav className="tool-links" aria-label="Document conversion tools">
            <a href="/pdf-to-markdown/">PDF to Markdown</a>
            <a href="/docx-to-markdown/">DOCX to Markdown</a>
            <a href="/pptx-to-markdown/">PPTX to Markdown</a>
            <a href="/excel-to-markdown/">Excel to Markdown</a>
          </nav>
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
