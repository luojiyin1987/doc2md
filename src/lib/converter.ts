type WorkerResponse =
  | { id: number; ok: true; markdown: string }
  | {
      id: number
      ok: false
      error: { message: string; code?: string }
    }

type PendingConversion = {
  resolve: (markdown: string) => void
  reject: (error: Error) => void
}

export type ConversionError = Error & {
  code?: string
}

let worker: Worker | undefined
let nextRequestId = 0
const pending = new Map<number, PendingConversion>()

function conversionError(message: string, code?: string): ConversionError {
  const error = new Error(message) as ConversionError
  if (code) {
    error.code = code
  }
  return error
}

function getWorker() {
  if (worker) {
    return worker
  }

  worker = new Worker(new URL('../converter.worker.ts', import.meta.url), {
    type: 'module',
  })

  worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
    const response = event.data
    const request = pending.get(response.id)

    if (!request) {
      return
    }

    pending.delete(response.id)

    if (response.ok) {
      if (!response.markdown.trim()) {
        request.reject(
          conversionError(
            'No extractable text was found in this document.',
            'empty',
          ),
        )
        return
      }

      request.resolve(response.markdown)
      return
    }

    request.reject(conversionError(response.error.message, response.error.code))
  })

  worker.addEventListener('error', (event) => {
    const error = new Error(event.message || 'Document conversion worker failed')
    for (const request of pending.values()) {
      request.reject(error)
    }
    pending.clear()
    worker?.terminate()
    worker = undefined
  })

  return worker
}

export async function convertDocument(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const id = ++nextRequestId
  const conversionWorker = getWorker()

  return new Promise<string>((resolve, reject) => {
    pending.set(id, { resolve, reject })
    conversionWorker.postMessage({ id, name: file.name, bytes }, [bytes])
  })
}
