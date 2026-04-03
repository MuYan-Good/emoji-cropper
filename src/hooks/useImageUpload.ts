import { useState, useCallback, useRef, useEffect } from 'react'
import { validateFile, getImageType } from '../utils/fileHelper'
import type { ImageType } from '../utils/fileHelper'

export interface ImageInfo {
  width: number
  height: number
  type: ImageType
  fileName: string
  fileSize: number
}

export interface UseImageUploadReturn {
  image: HTMLImageElement | null
  imageInfo: ImageInfo | null
  isLoading: boolean
  error: string | null
  upload: (file: File) => Promise<void>
  reset: () => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      revokeObjectUrl()
    }
  }, [revokeObjectUrl])

  const upload = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    revokeObjectUrl()
    setImage(null)
    setImageInfo(null)

    try {
      validateFile(file)

      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      objectUrlRef.current = objectUrl

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          objectUrlRef.current = null
          reject(new Error('图片加载失败'))
        }
        img.src = objectUrl
      })

      setImage(img)
      setImageInfo({
        width: img.width,
        height: img.height,
        type: getImageType(file),
        fileName: file.name,
        fileSize: file.size,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '上传失败'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [revokeObjectUrl])

  const reset = useCallback(() => {
    revokeObjectUrl()
    setImage(null)
    setImageInfo(null)
    setError(null)
    setIsLoading(false)
  }, [revokeObjectUrl])

  return {
    image,
    imageInfo,
    isLoading,
    error,
    upload,
    reset,
  }
}
