import { useState, useCallback } from 'react'
import type { CropResult, EmojiItem } from '../types/image'

export interface UseEmojiGridReturn {
  emojis: EmojiItem[]
  setEmojisFromResults: (results: CropResult[]) => void
  updateFileName: (id: string, fileName: string) => void
  toggleSelect: (id: string) => void
  selectAll: () => void
  deselectAll: () => void
  getSelectedEmojis: () => EmojiItem[]
  clearEmojis: () => void
}

export function useEmojiGrid(): UseEmojiGridReturn {
  const [emojis, setEmojis] = useState<EmojiItem[]>([])

  const setEmojisFromResults = useCallback((results: CropResult[]) => {
    setEmojis(
      results.map((result, index) => ({
        id: `emoji-${index}`,
        blob: result.blob,
        fileName: `emoji_${String(index + 1).padStart(2, '0')}`,
        index,
        isSelected: true,
        objectUrl: URL.createObjectURL(result.blob),
      })),
    )
  }, [])

  const updateFileName = useCallback((id: string, fileName: string) => {
    setEmojis((prev) =>
      prev.map((emoji) => (emoji.id === id ? { ...emoji, fileName } : emoji)),
    )
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setEmojis((prev) =>
      prev.map((emoji) =>
        emoji.id === id ? { ...emoji, isSelected: !emoji.isSelected } : emoji,
      ),
    )
  }, [])

  const selectAll = useCallback(() => {
    setEmojis((prev) => prev.map((emoji) => ({ ...emoji, isSelected: true })))
  }, [])

  const deselectAll = useCallback(() => {
    setEmojis((prev) => prev.map((emoji) => ({ ...emoji, isSelected: false })))
  }, [])

  const getSelectedEmojis = useCallback(
    () => emojis.filter((emoji) => emoji.isSelected),
    [emojis],
  )

  const clearEmojis = useCallback(() => {
    setEmojis((prev) => {
      prev.forEach((emoji) => URL.revokeObjectURL(emoji.objectUrl))
      return []
    })
  }, [])

  return {
    emojis,
    setEmojisFromResults,
    updateFileName,
    toggleSelect,
    selectAll,
    deselectAll,
    getSelectedEmojis,
    clearEmojis,
  }
}
