import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CompressControls } from './CompressControls'

const defaultProps = {
  options: {
    quality: 80,
    format: 'jpeg' as const,
    outputSize: { width: 0, height: 0 },
    scalePercent: 100,
    aspectRatioLocked: true,
  },
  previewBlob: null as Blob | null,
  previewFileSize: 0,
  isPreviewLoading: false,
  originalFileSize: 102400,
  originalSize: { width: 800, height: 600 },
  onOptionsChange: vi.fn(),
  onCompressAll: vi.fn(),
  isCompressing: false,
  hasFiles: true,
}

describe('CompressControls', () => {
  afterEach(cleanup)

  it('should render format selection buttons', () => {
    render(<CompressControls {...defaultProps} />)
    expect(screen.getByText('PNG')).toBeTruthy()
    expect(screen.getByText('JPEG')).toBeTruthy()
  })

  it('should call onOptionsChange when JPEG format is selected', () => {
    const onOptionsChange = vi.fn()
    render(<CompressControls {...defaultProps} onOptionsChange={onOptionsChange} />)
    fireEvent.click(screen.getByText('JPEG'))
    expect(onOptionsChange).toHaveBeenCalledWith({ format: 'jpeg' })
  })

  it('should call onOptionsChange when PNG format is selected', () => {
    const onOptionsChange = vi.fn()
    render(<CompressControls {...defaultProps} onOptionsChange={onOptionsChange} />)
    fireEvent.click(screen.getByText('PNG'))
    expect(onOptionsChange).toHaveBeenCalledWith({ format: 'png' })
  })

  it('should render quality slider', () => {
    render(<CompressControls {...defaultProps} />)
    const slider = screen.getByRole('slider')
    expect(slider).toBeTruthy()
    expect((slider as HTMLInputElement).value).toBe('80')
  })

  it('should call onOptionsChange when quality changes', () => {
    const onOptionsChange = vi.fn()
    render(<CompressControls {...defaultProps} onOptionsChange={onOptionsChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '50' } })
    expect(onOptionsChange).toHaveBeenCalledWith({ quality: 50 })
  })

  it('should disable quality slider when format is PNG', () => {
    render(<CompressControls {...defaultProps} options={{ ...defaultProps.options, format: 'png' }} />)
    const slider = screen.getByRole('slider') as HTMLInputElement
    expect(slider.disabled).toBe(true)
  })

  it('should enable quality slider when format is JPEG', () => {
    render(<CompressControls {...defaultProps} options={{ ...defaultProps.options, format: 'jpeg' }} />)
    const slider = screen.getByRole('slider') as HTMLInputElement
    expect(slider.disabled).toBe(false)
  })

  it('should show PNG format hint when format is PNG', () => {
    render(<CompressControls {...defaultProps} options={{ ...defaultProps.options, format: 'png' }} />)
    expect(screen.getByText(/PNG.*无损格式/)).toBeTruthy()
  })

  it('should render scale preset buttons', () => {
    render(<CompressControls {...defaultProps} />)
    expect(screen.getByText('25%')).toBeTruthy()
    expect(screen.getByText('50%')).toBeTruthy()
    expect(screen.getByText('75%')).toBeTruthy()
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('should call onOptionsChange when scale preset is clicked', () => {
    const onOptionsChange = vi.fn()
    render(<CompressControls {...defaultProps} onOptionsChange={onOptionsChange} />)
    fireEvent.click(screen.getByText('50%'))
    expect(onOptionsChange).toHaveBeenCalledWith({ scalePercent: 50 })
  })

  it('should render aspect ratio lock button', () => {
    render(<CompressControls {...defaultProps} />)
    expect(screen.getByText(/锁定宽高比/)).toBeTruthy()
  })

  it('should disable compress button when hasFiles is false', () => {
    render(<CompressControls {...defaultProps} hasFiles={false} />)
    const buttons = screen.getAllByRole('button')
    const compressButton = buttons.find(btn => btn.textContent?.includes('一键压缩'))
    expect((compressButton as HTMLButtonElement)?.disabled).toBe(true)
  })

  it('should call onCompressAll when compress button is clicked', () => {
    const onCompressAll = vi.fn()
    render(<CompressControls {...defaultProps} onCompressAll={onCompressAll} />)
    const buttons = screen.getAllByRole('button')
    const compressButton = buttons.find(btn => btn.textContent?.includes('一键压缩'))
    fireEvent.click(compressButton!)
    expect(onCompressAll).toHaveBeenCalled()
  })
})
