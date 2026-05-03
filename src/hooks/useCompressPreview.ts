import { useState, useCallback, useRef } from 'react'
import type { CompressOptions } from '../types/compress'
import { getPreviewBlob } from '../utils/imageCompressor'

const DEBOUNCE_MS = 150

export interface UseCompressPreviewReturn {
  previewBlob: Blob | null
  previewFileSize: number
  isPreviewLoading: boolean
  updatePreview: (file: File | null, options: CompressOptions) => void
}

export function useCompressPreview(): UseCompressPreviewReturn {
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)
  const [previewFileSize, setPreviewFileSize] = useState(0)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updatePreview = useCallback((file: File | null, options: CompressOptions) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    if (file === null) {
      setPreviewBlob(null)
      setPreviewFileSize(0)
      setIsPreviewLoading(false)
      return
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsPreviewLoading(true)

      try {
        const blob = await getPreviewBlob(file, options)
        setPreviewBlob(blob)
        setPreviewFileSize(blob.size)
      } catch {
        setPreviewBlob(null)
        setPreviewFileSize(0)
      } finally {
        setIsPreviewLoading(false)
      }
    }, DEBOUNCE_MS)
  }, [])

  return {
    previewBlob,
    previewFileSize,
    isPreviewLoading,
    updatePreview,
  }
}
