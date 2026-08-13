import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Converter from './Converter'
import './styles.css'
import './seo.css'

const root = document.getElementById('converter-root')

if (!root) {
  throw new Error('Missing #converter-root element')
}

createRoot(root).render(
  <StrictMode>
    <Converter
      accept={root.dataset.accept}
      formats={root.dataset.formats}
      dropLabel={root.dataset.dropLabel}
    />
  </StrictMode>,
)
