import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { TabNav } from './TabNav'

afterEach(cleanup)

describe('TabNav', () => {
  it('should render two tabs: crop and compress', () => {
    render(<TabNav activeTab="crop" onTabChange={vi.fn()} />)
    expect(screen.getByText('裁剪工具')).toBeTruthy()
    expect(screen.getByText('图片压缩')).toBeTruthy()
  })

  it('should call onTabChange with "compress" when compress tab is clicked', () => {
    const onTabChange = vi.fn()
    render(<TabNav activeTab="crop" onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('图片压缩'))
    expect(onTabChange).toHaveBeenCalledWith('compress')
  })

  it('should call onTabChange with "crop" when crop tab is clicked', () => {
    const onTabChange = vi.fn()
    render(<TabNav activeTab="compress" onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('裁剪工具'))
    expect(onTabChange).toHaveBeenCalledWith('crop')
  })

  it('should apply active styles to crop tab when activeTab is "crop"', () => {
    render(<TabNav activeTab="crop" onTabChange={vi.fn()} />)
    const cropTab = screen.getByText('裁剪工具').closest('button')!
    const compressTab = screen.getByText('图片压缩').closest('button')!
    expect(cropTab.style.color).toBe('white')
    expect(compressTab.style.color).not.toBe('white')
  })

  it('should apply active styles to compress tab when activeTab is "compress"', () => {
    render(<TabNav activeTab="compress" onTabChange={vi.fn()} />)
    const cropTab = screen.getByText('裁剪工具').closest('button')!
    const compressTab = screen.getByText('图片压缩').closest('button')!
    expect(compressTab.style.color).toBe('white')
    expect(cropTab.style.color).not.toBe('white')
  })
})
