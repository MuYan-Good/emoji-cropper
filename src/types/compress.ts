import type { OutputSize } from './image'

export type CompressFormat = 'png' | 'jpeg'

export interface CompressOptions {
  quality: number
  format: CompressFormat
  outputSize: OutputSize
  scalePercent: number
  aspectRatioLocked: boolean
}

export interface CompressItem {
  id: string
  file: File
  fileName: string
  originalWidth: number
  originalHeight: number
  originalFileSize: number
  objectUrl: string
  compressedBlob: Blob | null
  compressedWidth: number
  compressedHeight: number
  compressedFileSize: number
  compressedObjectUrl: string | null
  isCompressing: boolean
}

export interface CompressResult {
  blob: Blob
  width: number
  height: number
  fileSize: number
}
