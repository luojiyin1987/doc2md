import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { seoPages, site } from './pages.mjs'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function absoluteUrl(pathname = '/') {
  return `${site.origin}${pathname}`
}

function renderRelatedTools(currentSlug) {
  return seoPages
    .filter((page) => page.slug !== currentSlug)
    .map(
      (page) =>
        `<a href="/${escapeHtml(page.slug)}/">${escapeHtml(page.heading)}</a>`,
    )
    .join('\n              ')
}

function renderBenefits(benefits) {
  return benefits
    .map(
      ([heading, copy], index) => `<article>
              <span>0${index + 1}</span>
              <h2>${escapeHtml(heading)}</h2>
              <p>${escapeHtml(copy)}</p>
            </article>`,
    )
    .join('\n            ')
}

function renderPage(page) {
  const canonical = absoluteUrl(`/${page.slug}/`)
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.heading,
    url: canonical,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }).replaceAll('<', '\\u003c')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index,follow" />
    <meta name="theme-color" content="#f6f4ef" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <title>${escapeHtml(page.title)}</title>
    <script type="application/ld+json">${structuredData}</script>
  </head>
  <body>
    <div class="app-shell">
      <header class="site-header">
        <a class="brand" href="/" aria-label="doc2md home">doc<span>2</span>md</a>
        <div class="privacy-pill">Browser-only conversion</div>
      </header>

      <main>
        <section class="hero">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.heading)}</h1>
          <p class="hero-copy">${escapeHtml(page.intro)}</p>
        </section>

        <div
          id="converter-root"
          data-accept="${escapeHtml(page.accept)}"
          data-formats="${escapeHtml(page.formats)}"
          data-drop-label="${escapeHtml(page.dropLabel)}"
        ></div>

        <section class="trust-grid" aria-label="About ${escapeHtml(page.heading)}">
          ${renderBenefits(page.benefits)}
        </section>

        <section class="related-tools" aria-labelledby="related-tools-heading">
          <p class="eyebrow">More converters</p>
          <h2 id="related-tools-heading">Related document tools</h2>
          <nav class="tool-links" aria-label="Related document converters">
            ${renderRelatedTools(page.slug)}
          </nav>
        </section>
      </main>

      <footer>
        <span>doc2md</span>
        <span>Private document conversion in your browser</span>
      </footer>
    </div>

    <script type="module" src="/src/converter-main.tsx"></script>
  </body>
</html>
`
}

async function generatePages() {
  for (const page of seoPages) {
    const directory = join(process.cwd(), page.slug)
    await mkdir(directory, { recursive: true })
    await writeFile(join(directory, 'index.html'), renderPage(page), 'utf8')
  }

  const publicDirectory = join(process.cwd(), 'public')
  await mkdir(publicDirectory, { recursive: true })

  const urls = [
    absoluteUrl('/'),
    ...seoPages.map((page) => absoluteUrl(`/${page.slug}/`)),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}
</urlset>
`

  await writeFile(join(publicDirectory, 'sitemap.xml'), sitemap, 'utf8')
  await writeFile(
    join(publicDirectory, 'robots.txt'),
    `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`,
    'utf8',
  )
}

await generatePages()
