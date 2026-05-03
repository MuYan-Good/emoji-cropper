import type { CompressOptions, CompressResult } from '../types/compress'
import type { OutputSize } from '../types/image'

export function calculateOutputSize(
  originalWidth: number,
  originalHeight: number,
  scalePercent: number,
  aspectRatioLocked: boolean,
  customWidth?: number,
  customHeight?: number,
): OutputSize {
  let width: number
  let height: number

  if (aspectRatioLocked && customWidth !== undefined) {
    width = customWidth
    height = Math.round((customWidth / originalWidth) * originalHeight)
  } else if (aspectRatioLocked && customHeight !== undefined) {
    height = customHeight
    width = Math.round((customHeight / originalHeight) * originalWidth)
  } else if (customWidth !== undefined && customHeight !== undefined) {
    width = customWidth
    height = customHeight
  } else {
    const scale = scalePercent / 100
    width = Math.round(originalWidth * scale)
    height = Math.round(originalHeight * scale)
  }

  width = Math.max(1, width)
  height = Math.max(1, height)

  return { width, height }
}

export async function compressImage(
  file: File,
  options: CompressOptions,
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/gif') {
      reject(new Error('不支持 GIF 格式压缩'))
      return
    }

    const img = new Image()
    img.onload = () => {
      const { width, height } = calculateOutputSize(
        img.naturalWidth,
        img.naturalHeight,
        options.scalePercent,
        options.aspectRatioLocked,
        options.outputSize.width || undefined,
        options.outputSize.height || undefined,
      )

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        img.remove()
        reject(new Error('无法创建画布上下文'))
        return
      }

      if (options.format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const quality = options.format === 'jpeg' ? options.quality / 100 : undefined

      canvas.toBlob(
        (blob) => {
          canvas.width = 0
          canvas.height = 0
          img.remove()

          if (blob) {
            resolve({
              blob,
              width,
              height,
              fileSize: blob.size,
            })
          } else {
            reject(new Error('压缩失败'))
          }
        },
        `image/${options.format}`,
        quality,
      )
    }

    img.onerror = () => {
      img.remove()
      reject(new Error('无法加载图片'))
    }

    img.src = URL.createObjectURL(file)
  })
}

export async function getPreviewBlob(
  file: File,
  options: CompressOptions,
): Promise<Blob> {
  const result = await compressImage(file, options)
  return result.blob
}
