import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCompressPreview } from './useCompressPreview'

vi.mock('../utils/imageCompressor', () => ({
  getPreviewBlob: vi.fn().mockResolvedValue(new Blob(['preview'], { type: 'image/jpeg' })),
}))

describe('useCompressPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return null preview initially', () => {
    const { result } = renderHook(() => useCompressPreview())
    expect(result.current.previewBlob).toBeNull()
    expect(result.current.isPreviewLoading).toBe(false)
  })

  it('should set previewBlob to null when file is null', async () => {
    const { result } = renderHook(() => useCompressPreview())

    await act(async () => {
      result.current.updatePreview(null, {
        quality: 80,
        format: 'jpeg',
        outputSize: { width: 0, height: 0 },
        scalePercent: 100,
        aspectRatioLocked: true,
      })
    })

    expect(result.current.previewBlob).toBeNull()
  })

  it('should expose updatePreview function', () => {
    const { result } = renderHook(() => useCompressPreview())
    expect(typeof result.current.updatePreview).toBe('function')
  })

  it('should have previewFileSize initial value of 0', () => {
    const { result } = renderHook(() => useCompressPreview())
    expect(result.current.previewFileSize).toBe(0)
  })
})
