import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CompressGrid } from './CompressGrid'
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

describe('CompressGrid', () => {
  afterEach(cleanup)

  it('should render grid with items', () => {
    const items = [createMockItem(), createMockItem({ id: 'test-2', fileName: 'test2.png' })]
    render(
      <CompressGrid
        items={items}
        onRemove={vi.fn()}
        onDownload={vi.fn()}
        onDownloadAll={vi.fn()}
        isCompressing={false}
      />,
    )
    expect(screen.getAllByText(/test.*\.png/).length).toBe(2)
  })

  it('should show total count in header', () => {
    const items = [createMockItem(), createMockItem({ id: 'test-2' }), createMockItem({ id: 'test-3' })]
    render(
      <CompressGrid
        items={items}
        onRemove={vi.fn()}
        onDownload={vi.fn()}
        onDownloadAll={vi.fn()}
        isCompressing={false}
      />,
    )
    expect(screen.getByText(/已添加\s*3\s*张图片/)).toBeTruthy()
  })

  it('should disable download button when no items are compressed', () => {
    const items = [createMockItem()]
    render(
      <CompressGrid
        items={items}
        onRemove={vi.fn()}
        onDownload={vi.fn()}
        onDownloadAll={vi.fn()}
        isCompressing={false}
      />,
    )
    const buttons = screen.getAllByRole('button') as HTMLButtonElement[]
    const downloadButton = buttons.find(btn => btn.textContent?.includes('批量下载 ZIP'))
    expect(downloadButton?.disabled).toBe(true)
  })

  it('should enable download button when items are compressed', () => {
    const items = [
      createMockItem({
        compressedBlob: new Blob(['compressed'], { type: 'image/jpeg' }),
        compressedFileSize: 51200,
      }),
    ]
    render(
      <CompressGrid
        items={items}
        onRemove={vi.fn()}
        onDownload={vi.fn()}
        onDownloadAll={vi.fn()}
        isCompressing={false}
      />,
    )
    const buttons = screen.getAllByRole('button') as HTMLButtonElement[]
    const downloadButton = buttons.find(btn => btn.textContent?.includes('批量下载 ZIP'))
    expect(downloadButton?.disabled).toBe(false)
  })

  it('should call onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    const items = [createMockItem({ id: 'item-to-remove' })]
    render(
      <CompressGrid
        items={items}
        onRemove={onRemove}
        onDownload={vi.fn()}
        onDownloadAll={vi.fn()}
        isCompressing={false}
      />,
    )
    const removeButton = screen.getByText('×')
    fireEvent.click(removeButton)
    expect(onRemove).toHaveBeenCalledWith('item-to-remove')
  })
})
