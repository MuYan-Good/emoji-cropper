import {
  MAX_FILE_SIZE,
  SUPPORTED_TYPES,
  COMPRESS_SUPPORTED_INPUT_TYPES,
  COMPRESS_MAX_FILES,
} from './constants'

export type ImageType = 'png' | 'gif'

export function validateFile(file: File): void {
  if (!file) {
    throw new Error('文件为空')
  }

  if (file.size === 0) {
    throw new Error('文件为空')
  }

  if (!SUPPORTED_TYPES.includes(file.type as (typeof SUPPORTED_TYPES)[number])) {
    throw new Error('不支持的文件格式，仅支持 PNG 和 GIF')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('文件大小超过 10MB 限制')
  }
}

export function validateCompressFile(file: File): void {
  if (!file) {
    throw new Error('文件为空')
  }

  if (file.size === 0) {
    throw new Error('文件为空')
  }

  const supportedTypes = COMPRESS_SUPPORTED_INPUT_TYPES as unknown as string[]
  if (!supportedTypes.includes(file.type)) {
    throw new Error('不支持的文件格式，仅支持 PNG、JPEG 和 GIF')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('文件大小超过 10MB 限制')
  }
}

export function validateCompressFiles(files: File[], currentCount: number): void {
  if (currentCount + files.length > COMPRESS_MAX_FILES) {
    throw new Error('最多支持 20 张图片')
  }
}

export function getImageType(file: File): ImageType {
  if (file.type === 'image/gif') {
    return 'gif'
  }
  return 'png'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function generateFileName(index: number, prefix: string = 'emoji'): string {
  return `${prefix}_${String(index).padStart(2, '0')}.png`
}
