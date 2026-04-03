import { useState, useCallback } from 'react'
import { downloadSingle, downloadZip } from '../utils/zipExporter'
import type { EmojiItem } from '../types/image'

export interface UseExportReturn {
  isExporting: boolean
  error: string | null
  downloadOne: (emoji: EmojiItem) => Promise<void>
  downloadSelected: (emojis: EmojiItem[]) => Promise<void>
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadOne = useCallback(async (emoji: EmojiItem) => {
    setIsExporting(true)
    setError(null)
    try {
      await downloadSingle(emoji)
    } catch (err) {
      const message = err instanceof Error ? err.message : '下载失败'
      setError(message)
    } finally {
      setIsExporting(false)
    }
  }, [])

  const downloadSelected = useCallback(async (emojis: EmojiItem[]) => {
    if (emojis.length === 0) return

    setIsExporting(true)
    setError(null)
    try {
      await downloadZip(emojis)
    } catch (err) {
      const message = err instanceof Error ? err.message : '打包下载失败'
      setError(message)
    } finally {
      setIsExporting(false)
    }
  }, [])

  return {
    isExporting,
    error,
    downloadOne,
    downloadSelected,
  }
}
