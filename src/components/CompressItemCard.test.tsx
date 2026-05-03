import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CompressItemCard } from './CompressItemCard'
import type { CompressItem } from '../types/compress'

const createMockItem = (overrides: Partial<CompressItem> = {}): CompressItem => ({
  id: 'test-1',
  file: new File(['content'], 'test.png', { type: 'image/png' }),
  fileName: 'test.png',
  originalWidth: 800,
  originalHeight: 600,
  originalFileSize: 102400,
  objectUrl: 'blob:test-url',
  compressedBlob: null,
  compressedWidth: 0,
  compressedHeight: 0,
  compressedFileSize: 0,
  compressedObjectUrl: null,
  isCompressing: false,
  ...overrides,
})

describe('CompressItemCard', () => {
  afterEach(cleanup)

  it('should render thumbnail using objectUrl', () => {
    const item = createMockItem({ objectUrl: 'blob:thumbnail' })
    render(<CompressItemCard item={item} onRemove={vi.fn()} onDownload={vi.fn()} />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toBe('blob:thumbnail')
  })

  it('should display fileName', () => {
    const item = createMockItem({ fileName: 'my-emoji.png' })
    render(<CompressItemCard item={item} onRemove={vi.fn()} onDownload={vi.fn()} />)
    expect(screen.getByText('my-emoji.png')).toBeTruthy()
  })

  it('should display original dimensions', () => {
    const item = createMockItem({ originalWidth: 800, originalHeight: 600 })
    render(<CompressItemCard item={item} onRemove={vi.fn()} onDownload={vi.fn()} />)
    expect(screen.getByText(/800\s*×\s*600/)).toBeTruthy()
  })

  it('should display original file size in KB', () => {
    const item = createMockItem({ originalFileSize: 102400 })
    render(<CompressItemCard item={item} onRemove={vi.fn()} onDownload={vi.fn()} />)
    expect(screen.getByText(/100\s*KB/)).toBeTruthy()
  })

  it('should call onRemove with item id when delete button is clicked', () => {
    const item = createMockItem({ id: 'item-123' })
    const onRemove = vi.fn()
    render(<CompressItemCard item={item} onRemove={onRemove} onDownload={vi.fn()} />)
    fireEvent.click(screen.getByText('×'))
    expect(onRemove).toHaveBeenCalledWith('item-123')
  })

  it('should show compressed info after compression', () => {
    const item = createMockItem({
      compressedBlob: new Blob(['compressed'], { type: 'image/jpeg' }),
      compressedWidth: 400,
      compressedHeight: 300,
      compressedFileSize: 51200,
    })
    render(<CompressItemCard item={item} onRemove={vi.fn()} onDownload={vi.fn()} />)
    expect(screen.getByText(/50\s*KB/)).toBeTruthy()
    expect(screen.getByText(/400\s*×\s*300/)).toBeTruthy()
  })

  it('should show "不支持压缩" for GIF files', () => {
    const item = createMockItem({
      file: new File(['gif'], 'animation.gif', { type: 'image/gif' }),
      fileName: 'animation.gif',
      originalFileSize: 204800,
    })
    render(<CompressItemCard item={item} onRemove={vi.fn()} onDownload={vi.fn()} />)
    expect(screen.getByText('不支持压缩')).toBeTruthy()
  })
})
