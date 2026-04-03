import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { EmojiItem } from '../types/image'

export async function downloadSingle(emoji: EmojiItem): Promise<void> {
  const blob = emoji.blob
  const fileName = emoji.fileName.endsWith('.png')
    ? emoji.fileName
    : `${emoji.fileName}.png`
  saveAs(blob, fileName)
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

export async function downloadZip(emojis: EmojiItem[], zipName = 'emojis.zip'): Promise<void> {
  const zipBlob = await createZipFromEmojis(emojis)
  saveAs(zipBlob, zipName)
}
