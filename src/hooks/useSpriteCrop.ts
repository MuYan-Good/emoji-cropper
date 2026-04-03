import { useState, useCallback } from 'react'
import { cropSprite } from '../utils/imageCropper'
import type { GridConfig, CropResult, OutputSize } from '../types/image'

export interface UseSpriteCropReturn {
  results: CropResult[]
  isCropping: boolean
  error: string | null
  crop: (image: HTMLImageElement | null, config: GridConfig, outputSize?: OutputSize) => Promise<void>
  reset: () => void
}

export function useSpriteCrop(): UseSpriteCropReturn {
  const [results, setResults] = useState<CropResult[]>([])
  const [isCropping, setIsCropping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const crop = useCallback(
    async (image: HTMLImageElement | null, config: GridConfig, outputSize?: OutputSize) => {
      if (!image) {
        setError('图片未加载')
        return
      }

      if (config.rows <= 0) {
        setError('行数必须大于 0')
        return
      }

      if (config.cols <= 0) {
        setError('列数必须大于 0')
        return
      }

      if (outputSize && outputSize.width <= 0) {
        setError('输出宽度必须大于 0')
        return
      }

      if (outputSize && outputSize.height <= 0) {
        setError('输出高度必须大于 0')
        return
      }

      setIsCropping(true)
      setError(null)
      setResults([])

      try {
        const blobs = await cropSprite(image, config, outputSize)
        setResults(blobs)
      } catch (err) {
        const message = err instanceof Error ? err.message : '裁剪失败'
        setError(message)
      } finally {
        setIsCropping(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setResults([])
    setError(null)
    setIsCropping(false)
  }, [])

  return {
    results,
    isCropping,
    error,
    crop,
    reset,
  }
}
