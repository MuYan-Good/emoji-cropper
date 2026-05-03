import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { EmojiItem } from '../types/image'
import type { CompressItem } from '../types/compress'

export function getFileExtension(blob: Blob): string {
  if (blob.type === 'image/jpeg') return 'jpg'
  if (blob.type === 'image/png') return 'png'
  return 'png'
}

export function getDownloadFileName(baseName: string, blob: Blob): string {
  const ext = getFileExtension(blob)
  const nameWithoutExt = baseName.replace(/\.[^.]+$/, '')
  return `${nameWithoutExt}.${ext}`
}

export async function downloadSingle(emoji: EmojiItem): Promise<void> {
  const blob = emoji.blob
  const fileName = emoji.fileName.endsWith('.png')
    ? emoji.fileName
    : `${emoji.fileName}.png`
  saveAs(blob, fileName)
}

export async function downloadCompressItem(item: CompressItem): Promise<void> {
  if (!item.compressedBlob) return
  const ext = getFileExtension(item.compressedBlob)
  const baseName = item.fileName.replace(/\.[^.]+$/, '')
  const fileName = `${baseName}_compressed.${ext}`
  saveAs(item.compressedBlob, fileName)
}

export async function createZipFromEmojis(emojis: EmojiItem[]): Promise<Blob> {
  const zip = new JSZip()

  for (const emoji of emojis) {
    const fileName = emoji.fileName.endsWith('.png')
      ? emoji.fileName
      : `${emoji.fileName}.png`
    zip.file(fileName, emoji.blob)
  }

  return zip.generateAsync({ type: 'blob' })
}

export async function createZipFromCompressItems(items: CompressItem[]): Promise<Blob> {
  const zip = new JSZip()

  for (const item of items) {
    if (!item.compressedBlob) continue
    const ext = getFileExtension(item.compressedBlob)
    const baseName = item.fileName.replace(/\.[^.]+$/, '')
    const fileName = `${baseName}_compressed.${ext}`
    zip.file(fileName, item.compressedBlob)
  }

  return zip.generateAsync({ type: 'blob' })
}

export async function downloadZip(emojis: EmojiItem[], zipName = 'emojis.zip'): Promise<void> {
  const zipBlob = await createZipFromEmojis(emojis)
  saveAs(zipBlob, zipName)
}

export async function downloadCompressZip(items: CompressItem[], zipName = 'compressed.zip'): Promise<void> {
  const zipBlob = await createZipFromCompressItems(items)
  saveAs(zipBlob, zipName)
}
