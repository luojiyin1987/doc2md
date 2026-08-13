# doc2md

Private, browser-only document to Markdown conversion.

`doc2md` converts common office documents, PDFs, EPUBs, CSV files, and OpenDocument files into clean Markdown using [`@firecrawl/anydoc-wasm`](https://github.com/firecrawl/anydoc). Conversion runs locally in a Web Worker, so documents do not need to be uploaded to a server.

## Supported formats

- Word: `.doc`, `.docx`, `.docm`
- PowerPoint: `.ppt`, `.pps`, `.pot`, `.pptx`, `.pptm`, `.ppsx`, `.ppsm`
- Excel: `.xls`, `.xlsx`, `.xlsm`, `.xlsb`
- OpenDocument: `.odt`, `.ods`, `.odp`
- Rich Text Format: `.rtf`
- EPUB: `.epub`
- CSV: `.csv`
- PDF: `.pdf` (text-based PDFs; scanned/image-only PDFs need OCR)

## Development

```bash
npm install
npm run dev
```

Build the production bundle with:

```bash
npm run build
```

## Architecture

```text
File input / drag and drop
        │
        ▼
Browser File API
        │
        ▼
Web Worker
        │
        ▼
@firecrawl/anydoc-wasm
        │
        ▼
Markdown
   ├─ Copy
   └─ Download .md
```

The first version intentionally displays Markdown as plain text instead of rendering arbitrary converted content back into HTML. This keeps the conversion path small and avoids introducing an HTML-rendering/sanitization dependency.

## License

MIT
