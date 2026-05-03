import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCompressImages } from './useCompressImages'

const PNG_FILE_1 = new File(['png-content-1'], 'test1.png', { type: 'image/png' })
const PNG_FILE_2 = new File(['png-content-2'], 'test2.png', { type: 'image/png' })

const mockCreateObjectURL = vi.fn(() => 'blob:test-url')
const mockRevokeObjectURL = vi.fn()

vi.stubGlobal('URL', {
  createObjectURL: mockCreateObjectURL,
  revokeObjectURL: mockRevokeObjectURL,
})

vi.stubGlobal('Image', class {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  naturalWidth = 800
  naturalHeight = 600
  src = ''
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 0)
  }
  remove() {}
})

describe('useCompressImages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('addFiles', () => {
    it('should add single PNG file to items', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1])
      })
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].fileName).toBe('test1.png')
      expect(result.current.items[0].originalWidth).toBe(800)
      expect(result.current.items[0].originalHeight).toBe(600)
    })

    it('should add multiple files to items', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1, PNG_FILE_2])
      })
      expect(result.current.items).toHaveLength(2)
    })

    it('should set error when adding files exceeds 20', async () => {
      const { result } = renderHook(() => useCompressImages())
      const manyFiles = Array(21).fill(PNG_FILE_1)
      await act(async () => {
        await result.current.addFiles(manyFiles)
      })
      expect(result.current.error).toBe('最多支持 20 张图片')
    })
  })

  describe('removeFile', () => {
    it('should remove file from items', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1, PNG_FILE_2])
      })
      const itemId = result.current.items[0].id
      await act(async () => {
        result.current.removeFile(itemId)
      })
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].fileName).toBe('test2.png')
    })

    it('should revoke object URL when removing', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1])
      })
      const itemId = result.current.items[0].id
      await act(async () => {
        result.current.removeFile(itemId)
      })
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    })
  })

  describe('clearAll', () => {
    it('should clear all items', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1, PNG_FILE_2])
      })
      expect(result.current.items).toHaveLength(2)
      await act(async () => {
        result.current.clearAll()
      })
      expect(result.current.items).toHaveLength(0)
    })

    it('should revoke all object URLs when clearing', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1, PNG_FILE_2])
      })
      await act(async () => {
        result.current.clearAll()
      })
      expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2)
    })
  })

  describe('updateOptions', () => {
    it('should update quality option', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        result.current.updateOptions({ quality: 50 })
      })
      expect(result.current.options.quality).toBe(50)
    })

    it('should update format option', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        result.current.updateOptions({ format: 'jpeg' })
      })
      expect(result.current.options.format).toBe('jpeg')
    })
  })

  describe('getCompressedItems', () => {
    it('should return items with compressed results', async () => {
      const { result } = renderHook(() => useCompressImages())
      await act(async () => {
        await result.current.addFiles([PNG_FILE_1])
      })
      const compressed = result.current.getCompressedItems()
      expect(compressed).toHaveLength(0)
    })
  })
})
