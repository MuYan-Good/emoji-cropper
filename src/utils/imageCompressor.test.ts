import { describe, it, expect } from 'vitest'
import { calculateOutputSize } from './imageCompressor'

describe('calculateOutputSize', () => {
  it('should calculate 50% scale correctly with aspect ratio locked', () => {
    const result = calculateOutputSize(800, 600, 50, true)
    expect(result.width).toBe(400)
    expect(result.height).toBe(300)
  })

  it('should calculate 100% scale correctly with aspect ratio locked', () => {
    const result = calculateOutputSize(800, 600, 100, true)
    expect(result.width).toBe(800)
    expect(result.height).toBe(600)
  })

  it('should use custom dimensions when aspect ratio is not locked', () => {
    const result = calculateOutputSize(800, 600, 100, false, 200, 150)
    expect(result.width).toBe(200)
    expect(result.height).toBe(150)
  })

  it('should calculate width from custom when aspect ratio locked', () => {
    const result = calculateOutputSize(800, 600, 100, true, 200, undefined)
    expect(result.width).toBe(200)
    expect(result.height).toBe(150)
  })

  it('should calculate height from custom when aspect ratio locked', () => {
    const result = calculateOutputSize(800, 600, 100, true, undefined, 150)
    expect(result.width).toBe(200)
    expect(result.height).toBe(150)
  })

  it('should use scale percent as primary when custom values not provided', () => {
    const result = calculateOutputSize(800, 600, 75, true)
    expect(result.width).toBe(600)
    expect(result.height).toBe(450)
  })

  it('should round dimensions to integers', () => {
    const result = calculateOutputSize(100, 100, 33, true)
    expect(Number.isInteger(result.width)).toBe(true)
    expect(Number.isInteger(result.height)).toBe(true)
  })

  it('should return minimum of 1 for any dimension', () => {
    const result = calculateOutputSize(10, 10, 1, true)
    expect(result.width).toBeGreaterThanOrEqual(1)
    expect(result.height).toBeGreaterThanOrEqual(1)
  })
})
