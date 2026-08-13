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

## Cloudflare Workers deployment

The production site is configured as a Cloudflare Workers Static Assets project. `wrangler.jsonc` uploads the Vite `dist/` directory and maps the Worker to the `doc2md.itea.fit` Custom Domain.

For a manual deployment:

```bash
npm install
npm run build
npx wrangler login
npm run deploy
```

For automatic deployment with Cloudflare Workers Builds, connect the GitHub repository in **Workers & Pages → Import a repository** and use:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Root directory: `/`

Cloudflare handles non-production branch previews through Workers Builds when preview builds are enabled. The Wrangler configuration intentionally does not use SPA fallback so future SEO pages can be emitted as real static HTML files and unknown paths keep proper `404` behavior.

CI also runs `wrangler deploy --dry-run` after the production build to validate the deployment configuration without publishing.

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
