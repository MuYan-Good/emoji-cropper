import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CompressUploader } from './CompressUploader'

const defaultProps = {
  onFilesAdd: vi.fn(),
  disabled: false,
}

describe('CompressUploader', () => {
  afterEach(cleanup)

  it('should render dropzone with correct text', () => {
    render(<CompressUploader {...defaultProps} />)
    expect(screen.getByText('拖拽图片到这里，或点击选择文件')).toBeTruthy()
    expect(screen.getByText('支持 PNG、JPEG、GIF 格式')).toBeTruthy()
  })

  it('should render format tags', () => {
    render(<CompressUploader {...defaultProps} />)
    expect(screen.getByText('PNG')).toBeTruthy()
    expect(screen.getByText('JPEG')).toBeTruthy()
    expect(screen.getByText('GIF')).toBeTruthy()
  })

  it('should call onFilesAdd when files are dropped', () => {
    const onFilesAdd = vi.fn()
    render(<CompressUploader {...defaultProps} onFilesAdd={onFilesAdd} />)

    const dropzone = screen.getByTestId('dropzone')
    const file = new File(['content'], 'test.png', { type: 'image/png' })
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })

    expect(onFilesAdd).toHaveBeenCalled()
    const addedFiles = onFilesAdd.mock.calls[0][0]
    expect(addedFiles).toHaveLength(1)
    expect(addedFiles[0].name).toBe('test.png')
  })

  it('should call onFilesAdd when files are selected via click', () => {
    const onFilesAdd = vi.fn()
    render(<CompressUploader {...defaultProps} onFilesAdd={onFilesAdd} />)

    const input = screen.getByTestId('file-input') as HTMLInputElement
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(input, { target: { files: [file] } })

    expect(onFilesAdd).toHaveBeenCalled()
    const addedFiles = onFilesAdd.mock.calls[0][0]
    expect(addedFiles).toHaveLength(1)
    expect(addedFiles[0].name).toBe('test.jpg')
  })

  it('should be disabled when disabled prop is true', () => {
    const onFilesAdd = vi.fn()
    render(<CompressUploader {...defaultProps} onFilesAdd={onFilesAdd} disabled={true} />)

    const dropzone = screen.getByTestId('dropzone')
    const file = new File(['content'], 'test.png', { type: 'image/png' })
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })

    expect(onFilesAdd).not.toHaveBeenCalled()
  })
})
