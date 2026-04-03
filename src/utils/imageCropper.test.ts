import { describe, it, expect } from 'vitest'
import { resizeImage, cropImage, cropSprite } from './imageCropper'
import type { GridConfig, OutputSize } from '../types/image'

async function createTestPng(width: number, height: number, transparent = false): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  if (!transparent) {
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(0, 0, width, height)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create blob'))
    }, 'image/png')
  })
}

async function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

async function hasTransparency(blob: Blob): Promise<boolean> {
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 255) return true
  }
  return false
}

async function createSpriteImage(
  rows: number,
  cols: number,
  cellWidth: number,
  cellHeight: number,
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas')
  canvas.width = cols * cellWidth
  canvas.height = rows * cellHeight
  const ctx = canvas.getContext('2d')!

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hue = ((row * cols + col) * 360) / (rows * cols)
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
      ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight)
    }
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))), 'image/png')
  })

  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(blob)
  })

  return img
}

async function createTransparentSpriteImage(
  rows: number,
  cols: number,
  cellWidth: number,
  cellHeight: number,
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas')
  canvas.width = cols * cellWidth
  canvas.height = rows * cellHeight
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))), 'image/png')
  })

  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(blob)
  })

  return img
}

describe('resizeImage', () => {
  it('should resize 100x100 PNG to 240x240', async () => {
    const input = await createTestPng(100, 100)
    const result = await resizeImage(input, 240, 240)
    const dims = await getImageDimensions(result)

    expect(dims.width).toBe(240)
    expect(dims.height).toBe(240)
    expect(result.type).toBe('image/png')
  })

  it('should resize to non-square dimensions', async () => {
    const input = await createTestPng(100, 100)
    const result = await resizeImage(input, 240, 120)
    const dims = await getImageDimensions(result)

    expect(dims.width).toBe(240)
    expect(dims.height).toBe(120)
  })

  it('should preserve transparency', async () => {
    const input = await createTestPng(100, 100, true)
    const result = await resizeImage(input, 240, 240)
    const isTransparent = await hasTransparency(result)

    expect(isTransparent).toBe(true)
  })

  it('should throw error when width is 0', async () => {
    const input = await createTestPng(100, 100)
    await expect(resizeImage(input, 0, 240)).rejects.toThrow('输出宽度必须大于 0')
  })

  it('should throw error when height is 0', async () => {
    const input = await createTestPng(100, 100)
    await expect(resizeImage(input, 240, 0)).rejects.toThrow('输出高度必须大于 0')
  })
})

describe('cropImage', () => {
  it('should crop top-left cell from 400x400 sprite (4x4 grid)', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const result = await cropImage(image, 0, 0, config)
    const dims = await getImageDimensions(result)

    expect(dims.width).toBe(100)
    expect(dims.height).toBe(100)
    expect(result.type).toBe('image/png')
  })

  it('should crop bottom-right cell from 400x400 sprite (4x4 grid)', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const result = await cropImage(image, 3, 3, config)
    const dims = await getImageDimensions(result)

    expect(dims.width).toBe(100)
    expect(dims.height).toBe(100)
  })

  it('should crop from non-square sprite (800x400, 2x4 grid)', async () => {
    const image = await createSpriteImage(2, 4, 200, 200)
    const config: GridConfig = { rows: 2, cols: 4 }
    const result = await cropImage(image, 0, 0, config)
    const dims = await getImageDimensions(result)

    expect(dims.width).toBe(200)
    expect(dims.height).toBe(200)
  })

  it('should preserve transparency', async () => {
    const image = await createTransparentSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const result = await cropImage(image, 0, 0, config)
    const isTransparent = await hasTransparency(result)

    expect(isTransparent).toBe(true)
  })

  it('should throw error when rows is 0', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 0, cols: 4 }
    await expect(cropImage(image, 0, 0, config)).rejects.toThrow('行数必须大于 0')
  })

  it('should throw error when cols is 0', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 0 }
    await expect(cropImage(image, 0, 0, config)).rejects.toThrow('列数必须大于 0')
  })

  it('should throw error when row index is out of bounds', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    await expect(cropImage(image, 4, 0, config)).rejects.toThrow('行索引越界')
    await expect(cropImage(image, -1, 0, config)).rejects.toThrow('行索引越界')
  })

  it('should throw error when col index is out of bounds', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    await expect(cropImage(image, 0, 4, config)).rejects.toThrow('列索引越界')
    await expect(cropImage(image, 0, -1, config)).rejects.toThrow('列索引越界')
  })
})

describe('cropSprite', () => {
  it('should return 16 blobs for 4x4 grid with outputSize 240x240', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }
    const results = await cropSprite(image, config, outputSize)

    expect(results.length).toBe(16)
    for (const result of results) {
      const dims = await getImageDimensions(result.blob)
      expect(dims.width).toBe(240)
      expect(dims.height).toBe(240)
    }
  })

  it('should support non-square output size', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 120 }
    const results = await cropSprite(image, config, outputSize)

    expect(results.length).toBe(16)
    const dims = await getImageDimensions(results[0].blob)
    expect(dims.width).toBe(240)
    expect(dims.height).toBe(120)
  })

  it('should use default output size 240x240 when not specified', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const results = await cropSprite(image, config)

    expect(results.length).toBe(16)
    const dims = await getImageDimensions(results[0].blob)
    expect(dims.width).toBe(240)
    expect(dims.height).toBe(240)
  })

  it('should throw error when rows is 0', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 0, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }
    await expect(cropSprite(image, config, outputSize)).rejects.toThrow('行数必须大于 0')
  })

  it('should throw error when output width is 0', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 0, height: 240 }
    await expect(cropSprite(image, config, outputSize)).rejects.toThrow('输出宽度必须大于 0')
  })

  it('should throw error when output height is 0', async () => {
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 0 }
    await expect(cropSprite(image, config, outputSize)).rejects.toThrow('输出高度必须大于 0')
  })

  it('should return correct number of blobs for 2x3 grid', async () => {
    const image = await createSpriteImage(2, 3, 100, 100)
    const config: GridConfig = { rows: 2, cols: 3 }
    const outputSize: OutputSize = { width: 240, height: 240 }
    const results = await cropSprite(image, config, outputSize)

    expect(results.length).toBe(6)
  })
})
