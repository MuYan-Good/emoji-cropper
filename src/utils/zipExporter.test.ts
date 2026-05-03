import { describe, it, expect } from 'vitest'
import { getFileExtension, getDownloadFileName } from './zipExporter'

describe('zipExporter helpers', () => {
  describe('getFileExtension', () => {
    it('should return png for image/png blob', () => {
      const blob = new Blob([''], { type: 'image/png' })
      expect(getFileExtension(blob)).toBe('png')
    })

    it('should return jpg for image/jpeg blob', () => {
      const blob = new Blob([''], { type: 'image/jpeg' })
      expect(getFileExtension(blob)).toBe('jpg')
    })

    it('should return png for unknown type', () => {
      const blob = new Blob([''], { type: 'image/gif' })
      expect(getFileExtension(blob)).toBe('png')
    })
  })

  describe('getDownloadFileName', () => {
    it('should use jpg extension for jpeg blob', () => {
      const blob = new Blob([''], { type: 'image/jpeg' })
      const result = getDownloadFileName('test', blob)
      expect(result).toBe('test.jpg')
    })

    it('should use png extension for png blob', () => {
      const blob = new Blob([''], { type: 'image/png' })
      const result = getDownloadFileName('test', blob)
      expect(result).toBe('test.png')
    })

    it('should replace existing extension with correct one', () => {
      const blob = new Blob([''], { type: 'image/jpeg' })
      const result = getDownloadFileName('test.png', blob)
      expect(result).toBe('test.jpg')
    })
  })
})
