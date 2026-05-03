import { useState, useCallback } from 'react'
import type { CompressOptions, CompressItem, CompressFormat } from '../types/compress'
import { COMPRESS_QUALITY_DEFAULT } from '../utils/constants'
import { validateCompressFile, validateCompressFiles } from '../utils/fileHelper'
import { compressImage } from '../utils/imageCompressor'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

async function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.remove()
    }
    img.onerror = () => {
      reject(new Error('无法加载图片'))
      img.remove()
    }
    img.src = URL.createObjectURL(file)
  })
}

const initialOptions: CompressOptions = {
  quality: COMPRESS_QUALITY_DEFAULT,
  format: 'jpeg' as CompressFormat,
  outputSize: { width: 0, height: 0 },
  scalePercent: 100,
  aspectRatioLocked: true,
}

export interface UseCompressImagesReturn {
  items: CompressItem[]
  options: CompressOptions
  isCompressing: boolean
  error: string | null
  addFiles: (files: File[]) => Promise<void>
  removeFile: (id: string) => void
  updateOptions: (partial: Partial<CompressOptions>) => void
  compressAll: () => Promise<void>
  compressOne: (id: string) => Promise<void>
  clearAll: () => void
  getCompressedItems: () => CompressItem[]
}

export function useCompressImages(): UseCompressImagesReturn {
  const [items, setItems] = useState<CompressItem[]>([])
  const [options, setOptions] = useState<CompressOptions>(initialOptions)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addFiles = useCallback(async (files: File[]): Promise<void> => {
    setError(null)
    try {
      validateCompressFiles(files, items.length)
    } catch (e) {
      setError((e as Error).message)
      return
    }

    const newItems: CompressItem[] = []

    for (const file of files) {
      try {
        validateCompressFile(file)
        const dimensions = await loadImageDimensions(file)
        const objectUrl = URL.createObjectURL(file)

        const item: CompressItem = {
          id: generateId(),
          file,
          fileName: file.name,
          originalWidth: dimensions.width,
          originalHeight: dimensions.height,
          originalFileSize: file.size,
          objectUrl,
          compressedBlob: null,
          compressedWidth: 0,
          compressedHeight: 0,
          compressedFileSize: 0,
          compressedObjectUrl: null,
          isCompressing: false,
        }
        newItems.push(item)
      } catch {
        continue
      }
    }

    setItems((prev) => [...prev, ...newItems])
  }, [items.length])

  const removeFile = useCallback((id: string): void => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) {
        URL.revokeObjectURL(item.objectUrl)
        if (item.compressedObjectUrl) {
          URL.revokeObjectURL(item.compressedObjectUrl)
        }
      }
      return prev.filter((i) => i.id !== id)
    })
  }, [])

  const clearAll = useCallback((): void => {
    setItems((prev) => {
      prev.forEach((item) => {
        URL.revokeObjectURL(item.objectUrl)
        if (item.compressedObjectUrl) {
          URL.revokeObjectURL(item.compressedObjectUrl)
        }
      })
      return []
    })
  }, [])

  const updateOptions = useCallback((partial: Partial<CompressOptions>): void => {
    setOptions((prev) => ({ ...prev, ...partial }))
  }, [])

  const compressAll = useCallback(async (): Promise<void> => {
    setIsCompressing(true)
    for (const item of items) {
      if (item.file.type === 'image/gif') continue

      try {
        const result = await compressImage(item.file, options)

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  compressedBlob: result.blob,
                  compressedWidth: result.width,
                  compressedHeight: result.height,
                  compressedFileSize: result.fileSize,
                  compressedObjectUrl: URL.createObjectURL(result.blob),
                }
              : i,
          ),
        )
      } catch (e) {
        setError(`压缩失败: ${(e as Error).message}`)
      }
    }
    setIsCompressing(false)
  }, [items, options])

  const compressOne = useCallback(
    async (id: string): Promise<void> => {
      const item = items.find((i) => i.id === id)
      if (!item || item.file.type === 'image/gif') return

      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, isCompressing: true } : i,
        ),
      )

      try {
        const result = await compressImage(item.file, options)

        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  isCompressing: false,
                  compressedBlob: result.blob,
                  compressedWidth: result.width,
                  compressedHeight: result.height,
                  compressedFileSize: result.fileSize,
                  compressedObjectUrl: URL.createObjectURL(result.blob),
                }
              : i,
          ),
        )
      } catch (e) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, isCompressing: false } : i,
          ),
        )
        setError(`压缩失败: ${(e as Error).message}`)
      }
    },
    [items, options],
  )

  const getCompressedItems = useCallback((): CompressItem[] => {
    return items.filter((item) => item.compressedBlob !== null)
  }, [items])

  return {
    items,
    options,
    isCompressing,
    error,
    addFiles,
    removeFile,
    updateOptions,
    compressAll,
    compressOne,
    clearAll,
    getCompressedItems,
  }
}
