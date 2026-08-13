export const site = {
  origin: 'https://doc2md.itea.fit',
  name: 'doc2md',
}

export const seoPages = [
  {
    slug: 'pdf-to-markdown',
    title: 'PDF to Markdown Converter — Free & Private | doc2md',
    description:
      'Convert text-based PDF files to clean Markdown directly in your browser. Free, private, fast, and no document upload required.',
    eyebrow: 'PDF · private · browser-only',
    heading: 'PDF to Markdown Converter',
    intro:
      'Turn text-based PDF documents into clean Markdown locally in your browser. Your PDF stays on your device and the result is ready to copy or download.',
    accept: '.pdf',
    formats: 'PDF',
    dropLabel: 'Drop a PDF here',
    benefits: [
      ['Local conversion', 'The PDF is processed in WebAssembly in your browser instead of being uploaded to a conversion server.'],
      ['Clean Markdown', 'Extract text structure into Markdown that is easier to use in notes, documentation, and AI workflows.'],
      ['Text-based PDFs', 'Best for PDFs with extractable text. Scanned or image-only PDFs still require an OCR step.'],
    ],
  },
  {
    slug: 'docx-to-markdown',
    title: 'DOCX to Markdown Converter — Free & Private | doc2md',
    description:
      'Convert Word DOCX documents to clean Markdown locally in your browser. Free, private, fast, and no document upload required.',
    eyebrow: 'DOCX · Word · browser-only',
    heading: 'DOCX to Markdown Converter',
    intro:
      'Convert Microsoft Word documents into clean Markdown without sending the file to a server. Headings, lists, tables, and document structure are normalized for text workflows.',
    accept: '.doc,.docx,.docm',
    formats: 'DOC · DOCX · DOCM',
    dropLabel: 'Drop a Word document here',
    benefits: [
      ['Word to Markdown', 'Convert common Word formats into Markdown for documentation, repositories, notes, and AI context.'],
      ['Runs locally', 'Document bytes stay inside the browser while the WebAssembly converter does the work.'],
      ['Simple export', 'Review the Markdown output, copy it, or save it as a ready-to-use .md file.'],
    ],
  },
  {
    slug: 'pptx-to-markdown',
    title: 'PPTX to Markdown Converter — Free & Private | doc2md',
    description:
      'Convert PowerPoint PPTX presentations to clean Markdown locally in your browser. Free, private, and no presentation upload required.',
    eyebrow: 'PPTX · PowerPoint · browser-only',
    heading: 'PPTX to Markdown Converter',
    intro:
      'Turn PowerPoint presentations into Markdown for notes, documentation, search, and AI workflows. Conversion happens locally so the presentation does not need to leave your device.',
    accept: '.ppt,.pptx,.pptm,.pps,.ppsx,.ppsm,.pot',
    formats: 'PPT · PPTX · PPTM · PPSX',
    dropLabel: 'Drop a PowerPoint file here',
    benefits: [
      ['Slides to text', 'Normalize presentation text and structure into a Markdown document that is easier to reuse.'],
      ['Private by design', 'The browser performs the conversion locally with WebAssembly; there is no upload endpoint.'],
      ['One Markdown file', 'Copy the result immediately or download a .md file for later editing and indexing.'],
    ],
  },
  {
    slug: 'excel-to-markdown',
    title: 'Excel to Markdown Converter — Free & Private | doc2md',
    description:
      'Convert Excel XLSX spreadsheets to Markdown tables locally in your browser. Free, private, fast, and no spreadsheet upload required.',
    eyebrow: 'XLSX · Excel · browser-only',
    heading: 'Excel to Markdown Converter',
    intro:
      'Convert Excel workbooks into Markdown-friendly tables without uploading the spreadsheet. Use the output in documentation, issue trackers, repositories, and AI prompts.',
    accept: '.xls,.xlsx,.xlsm,.xlsb',
    formats: 'XLS · XLSX · XLSM · XLSB',
    dropLabel: 'Drop an Excel file here',
    benefits: [
      ['Tables to Markdown', 'Turn spreadsheet content into text-friendly Markdown tables for documentation and collaboration.'],
      ['No server upload', 'Workbook conversion runs locally in the browser through WebAssembly.'],
      ['Fast reuse', 'Copy the generated Markdown or download it as a .md file for downstream tools.'],
    ],
  },
]
