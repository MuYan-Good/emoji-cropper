export interface GridConfig {
  rows: number
  cols: number
}

export interface OutputSize {
  width: number
  height: number
}

export interface CropResult {
  blob: Blob
  row: number
  col: number
  originalSize: {
    width: number
    height: number
  }
}

export interface EmojiItem {
  id: string
  blob: Blob
  fileName: string
  index: number
  isSelected: boolean
  objectUrl: string
}
