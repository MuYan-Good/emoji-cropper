import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useImageUpload } from './useImageUpload'

function createTestFile(type: string, size: number, name: string): File {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

function createPngFile(sizeKB: number = 100): File {
  return createTestFile('image/png', sizeKB * 1024, 'test.png')
}

function createJpegFile(): File {
  return createTestFile('image/jpeg', 100 * 1024, 'test.jpg')
}

describe('useImageUpload', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useImageUpload())

    expect(result.current.image).toBeNull()
    expect(result.current.imageInfo).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should reject non-PNG/GIF files', async () => {
    const { result } = renderHook(() => useImageUpload())
    const jpegFile = createJpegFile()

    await act(async () => {
      await result.current.upload(jpegFile)
    })

    expect(result.current.error).toBe('不支持的文件格式，仅支持 PNG 和 GIF')
    expect(result.current.image).toBeNull()
  })

  it('should reject files larger than 10MB', async () => {
    const { result } = renderHook(() => useImageUpload())
    const largeFile = createPngFile(11 * 1024)

    await act(async () => {
      await result.current.upload(largeFile)
    })

    expect(result.current.error).toBe('文件大小超过 10MB 限制')
    expect(result.current.image).toBeNull()
  })

  it('should reject empty files', async () => {
    const { result } = renderHook(() => useImageUpload())
    const emptyFile = createTestFile('image/png', 0, 'empty.png')

    await act(async () => {
      await result.current.upload(emptyFile)
    })

    expect(result.current.error).toBe('文件为空')
  })

  it('should set isLoading to true during upload', async () => {
    const { result } = renderHook(() => useImageUpload())

    const uploadPromise = act(async () => {
      return result.current.upload(createPngFile())
    })

    expect(result.current.isLoading).toBe(true)

    await uploadPromise
  })

  it('should reset state when reset is called', async () => {
    const { result } = renderHook(() => useImageUpload())

    await act(async () => {
      await result.current.upload(createJpegFile())
    })

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.reset()
    })

    expect(result.current.image).toBeNull()
    expect(result.current.imageInfo).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })
})
