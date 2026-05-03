import { describe, it, expect } from 'vitest'
import {
  validateCompressFile,
  validateCompressFiles,
} from './fileHelper'

const PNG_FILE = new File(['png-content'], 'test.png', { type: 'image/png' })
const JPEG_FILE = new File(['jpeg-content'], 'test.jpg', { type: 'image/jpeg' })
const GIF_FILE = new File(['gif-content'], 'test.gif', { type: 'image/gif' })
const TXT_FILE = new File(['text-content'], 'test.txt', { type: 'text/plain' })
const EMPTY_FILE = new File([], 'empty.png', { type: 'image/png' })

describe('validateCompressFile', () => {
  it('should accept PNG file', () => {
    expect(() => validateCompressFile(PNG_FILE)).not.toThrow()
  })

  it('should accept JPEG file', () => {
    expect(() => validateCompressFile(JPEG_FILE)).not.toThrow()
  })

  it('should accept GIF file without throwing', () => {
    expect(() => validateCompressFile(GIF_FILE)).not.toThrow()
  })

  it('should throw for unsupported file type', () => {
    expect(() => validateCompressFile(TXT_FILE)).toThrow('不支持的文件格式，仅支持 PNG、JPEG 和 GIF')
  })

  it('should throw for empty file', () => {
    expect(() => validateCompressFile(EMPTY_FILE)).toThrow('文件为空')
  })

  it('should throw for file over 10MB', () => {
    const largeContent = new Uint8Array(11 * 1024 * 1024)
    const largeFile = new File([largeContent], 'large.png', { type: 'image/png' })
    expect(() => validateCompressFile(largeFile)).toThrow('文件大小超过 10MB 限制')
  })
})

describe('validateCompressFiles', () => {
  it('should accept array of valid files', () => {
    expect(() => validateCompressFiles([PNG_FILE, JPEG_FILE], 0)).not.toThrow()
  })

  it('should throw when total count exceeds 20', () => {
    const files = Array(21).fill(PNG_FILE)
    expect(() => validateCompressFiles(files, 0)).toThrow('最多支持 20 张图片')
  })

  it('should throw when adding would exceed 20', () => {
    const files = Array(18).fill(PNG_FILE)
    expect(() => validateCompressFiles(files, 5)).toThrow('最多支持 20 张图片')
  })

  it('should accept when adding stays within 20', () => {
    const files = Array(15).fill(PNG_FILE)
    expect(() => validateCompressFiles(files, 5)).not.toThrow()
  })
})
