import type { GridConfig, CropResult, OutputSize } from '../types/image'
import { DEFAULT_OUTPUT_SIZE } from './constants'

export async function resizeImage(blob: Blob, width: number, height: number): Promise<Blob> {
  if (width <= 0) {
    throw new Error('输出宽度必须大于 0')
  }
  if (height <= 0) {
    throw new Error('输出高度必须大于 0')
  }

  const img = new Image()
  const objectUrl = URL.createObjectURL(blob)

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = objectUrl
  })

  URL.revokeObjectURL(objectUrl)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(img, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error('图片缩放失败'))
        }
      },
      'image/png',
    )
  })
}

export async function cropImage(
  image: HTMLImageElement,
  row: number,
  col: number,
  config: GridConfig,
): Promise<Blob> {
  if (config.rows <= 0) {
    throw new Error('行数必须大于 0')
  }
  if (config.cols <= 0) {
    throw new Error('列数必须大于 0')
  }
  if (row < 0 || row >= config.rows) {
    throw new Error('行索引越界')
  }
  if (col < 0 || col >= config.cols) {
    throw new Error('列索引越界')
  }

  const cellWidth = image.width / config.cols
  const cellHeight = image.height / config.rows

  const srcX = col * cellWidth
  const srcY = row * cellHeight

  const canvas = document.createElement('canvas')
  canvas.width = cellWidth
  canvas.height = cellHeight
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(image, srcX, srcY, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error('图片裁剪失败'))
        }
      },
      'image/png',
    )
  })
}

export async function cropSprite(
  image: HTMLImageElement,
  config: GridConfig,
  outputSize: OutputSize = DEFAULT_OUTPUT_SIZE,
): Promise<CropResult[]> {
  if (config.rows <= 0) {
    throw new Error('行数必须大于 0')
  }
  if (config.cols <= 0) {
    throw new Error('列数必须大于 0')
  }
  if (outputSize.width <= 0) {
    throw new Error('输出宽度必须大于 0')
  }
  if (outputSize.height <= 0) {
    throw new Error('输出高度必须大于 0')
  }

  const results: CropResult[] = []
  const cellWidth = image.width / config.cols
  const cellHeight = image.height / config.rows

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const blob = await cropImage(image, row, col, config)
      const resizedBlob = await resizeImage(blob, outputSize.width, outputSize.height)
      results.push({
        blob: resizedBlob,
        row,
        col,
        originalSize: {
          width: cellWidth,
          height: cellHeight,
        },
      })
    }
  }

  return results
}
