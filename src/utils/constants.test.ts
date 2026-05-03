import { describe, it, expect } from 'vitest'
import {
  COMPRESS_QUALITY_DEFAULT,
  COMPRESS_SCALE_PRESETS,
  COMPRESS_SUPPORTED_INPUT_TYPES,
  COMPRESS_MAX_FILES,
} from './constants'
import type { CompressFormat, CompressOptions, CompressItem, CompressResult } from '../types/compress'

describe('compress constants', () => {
  it('COMPRESS_QUALITY_DEFAULT should be 80', () => {
    expect(COMPRESS_QUALITY_DEFAULT).toBe(80)
  })

  it('COMPRESS_SCALE_PRESETS should be [25, 50, 75, 100]', () => {
    expect(COMPRESS_SCALE_PRESETS).toEqual([25, 50, 75, 100])
  })

  it('COMPRESS_SUPPORTED_INPUT_TYPES should include png, jpeg, gif', () => {
    expect(COMPRESS_SUPPORTED_INPUT_TYPES).toContain('image/png')
    expect(COMPRESS_SUPPORTED_INPUT_TYPES).toContain('image/jpeg')
    expect(COMPRESS_SUPPORTED_INPUT_TYPES).toContain('image/gif')
    expect(COMPRESS_SUPPORTED_INPUT_TYPES).toHaveLength(3)
  })

  it('COMPRESS_MAX_FILES should be 20', () => {
    expect(COMPRESS_MAX_FILES).toBe(20)
  })
})

describe('compress types', () => {
  it('CompressFormat should accept png and jpeg', () => {
    const png: CompressFormat = 'png'
    const jpeg: CompressFormat = 'jpeg'
    expect(png).toBe('png')
    expect(jpeg).toBe('jpeg')
  })

  it('CompressOptions should contain all required fields', () => {
    const options: CompressOptions = {
      quality: 80,
      format: 'jpeg',
      outputSize: { width: 800, height: 600 },
      scalePercent: 100,
      aspectRatioLocked: true,
    }
    expect(options.quality).toBe(80)
    expect(options.format).toBe('jpeg')
    expect(options.outputSize.width).toBe(800)
    expect(options.outputSize.height).toBe(600)
    expect(options.scalePercent).toBe(100)
    expect(options.aspectRatioLocked).toBe(true)
  })

  it('CompressItem should contain all required fields', () => {
    const item: CompressItem = {
      id: 'test-1',
      file: new File([], 'test.png', { type: 'image/png' }),
      fileName: 'test.png',
      originalWidth: 800,
      originalHeight: 600,
      originalFileSize: 1024,
      objectUrl: 'blob:test',
      compressedBlob: null,
      compressedWidth: 0,
      compressedHeight: 0,
      compressedFileSize: 0,
      compressedObjectUrl: null,
      isCompressing: false,
    }
    expect(item.id).toBe('test-1')
    expect(item.compressedBlob).toBeNull()
    expect(item.isCompressing).toBe(false)
  })

  it('CompressResult should contain blob, width, height, fileSize', () => {
    const result: CompressResult = {
      blob: new Blob([], { type: 'image/jpeg' }),
      width: 400,
      height: 300,
      fileSize: 512,
    }
    expect(result.width).toBe(400)
    expect(result.height).toBe(300)
    expect(result.fileSize).toBe(512)
  })
})
