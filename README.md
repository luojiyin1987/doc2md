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

`npm run dev` generates the SEO entry pages before starting Vite.

Build the production bundle with:

```bash
npm run build
```

## Static SEO pages

The site uses Vite's multi-page build rather than client-side routing for search landing pages. `scripts/pages.mjs` is the source of truth for the format-specific pages and `scripts/generate-seo.mjs` generates their HTML before development and production builds.

Initial pages:

- `/pdf-to-markdown/`
- `/docx-to-markdown/`
- `/pptx-to-markdown/`
- `/excel-to-markdown/`

Each page contains its own static title, meta description, canonical URL, H1, explanatory content, related-tool links, and structured data. Only the converter itself is mounted as a React island, so the useful page content exists in the HTML before JavaScript runs.

The same generator also emits `robots.txt` and `sitemap.xml` into `public/`. Generated source HTML and discovery files are ignored by Git because they are deterministic build artifacts.

To add another SEO converter page, add one page definition to `scripts/pages.mjs`. Vite reads the same list for its multi-page HTML inputs.

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

Cloudflare uses `auto-trailing-slash` HTML handling, so generated `folder/index.html` pages have canonical trailing-slash URLs such as `/pdf-to-markdown/`. Missing assets keep real `404` responses; the project does not use SPA fallback.

CI also runs `wrangler deploy --dry-run` after the production build to validate the deployment configuration without publishing.

## Architecture

```text
Static HTML page
   ├─ title / description / canonical
   ├─ H1 + explanatory content
   ├─ related internal links
   └─ React converter island
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

Markdown is intentionally displayed as plain text instead of rendering arbitrary converted content back into HTML. This keeps the conversion path small and avoids introducing an HTML-rendering/sanitization dependency.

## License

MIT
