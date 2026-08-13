/// <reference lib="webworker" />

import init, {
  formatFromBytes,
  formatFromPath,
  toMarkdownBytes,
} from '@firecrawl/anydoc-wasm'

type WorkerRequest = {
  id: number
  name: string
  bytes: ArrayBuffer
}

type AnyDocError = Error & {
  code?: string
}

const scope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope
const ready = init()

scope.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const { id, name, bytes } = event.data

  try {
    await ready

    const input = new Uint8Array(bytes)
    const format = formatFromBytes(input) ?? formatFromPath(name)
    const markdown = toMarkdownBytes(input, format)

    scope.postMessage({ id, ok: true, markdown })
  } catch (cause) {
    const error = cause instanceof Error ? (cause as AnyDocError) : new Error(String(cause))

    scope.postMessage({
      id,
      ok: false,
      error: {
        message: error.message || 'Unable to convert this document',
        code: error.code,
      },
    })
  }
})
