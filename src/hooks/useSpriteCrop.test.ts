import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSpriteCrop } from './useSpriteCrop'
import type { GridConfig, OutputSize } from '../types/image'

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

describe('useSpriteCrop', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useSpriteCrop())

    expect(result.current.results).toEqual([])
    expect(result.current.isCropping).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should crop 4x4 sprite into 16 blobs', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.results.length).toBe(16)
    expect(result.current.error).toBeNull()
    expect(result.current.isCropping).toBe(false)
  })

  it('should support non-square output size', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 120 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.results.length).toBe(16)
    expect(result.current.error).toBeNull()
  })

  it('should set isCropping to true during crop', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }

    const cropPromise = act(async () => {
      return result.current.crop(image, config, outputSize)
    })

    expect(result.current.isCropping).toBe(true)

    await cropPromise
  })

  it('should return error when image is null', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }

    await act(async () => {
      await result.current.crop(null, config, outputSize)
    })

    expect(result.current.error).toBe('图片未加载')
    expect(result.current.results).toEqual([])
  })

  it('should return error when rows is 0', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 0, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.error).toBe('行数必须大于 0')
  })

  it('should return error when cols is 0', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 0 }
    const outputSize: OutputSize = { width: 240, height: 240 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.error).toBe('列数必须大于 0')
  })

  it('should return error when output width is 0', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 0, height: 240 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.error).toBe('输出宽度必须大于 0')
  })

  it('should return error when output height is 0', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 0 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.error).toBe('输出高度必须大于 0')
  })

  it('should reset state when reset is called', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }
    const outputSize: OutputSize = { width: 240, height: 240 }

    await act(async () => {
      await result.current.crop(image, config, outputSize)
    })

    expect(result.current.results.length).toBe(16)

    act(() => {
      result.current.reset()
    })

    expect(result.current.results).toEqual([])
    expect(result.current.error).toBeNull()
    expect(result.current.isCropping).toBe(false)
  })

  it('should use default output size when not specified', async () => {
    const { result } = renderHook(() => useSpriteCrop())
    const image = await createSpriteImage(4, 4, 100, 100)
    const config: GridConfig = { rows: 4, cols: 4 }

    await act(async () => {
      await result.current.crop(image, config)
    })

    expect(result.current.results.length).toBe(16)
  })
})
