import { useState, useCallback, useRef, useEffect } from 'react'
import type { EmojiItem } from '../types/image'

interface EmojiCardProps {
  emoji: EmojiItem
  onFileNameChange: (id: string, fileName: string) => void
  onToggleSelect: (id: string) => void
  onDownload: (emoji: EmojiItem) => void
}

export function EmojiCard({
  emoji,
  onFileNameChange,
  onToggleSelect,
  onDownload,
}: EmojiCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(emoji.fileName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
    setEditValue(emoji.fileName)
  }, [emoji.fileName])

  const handleBlur = useCallback(() => {
    const trimmedValue = editValue.trim()
    if (trimmedValue && trimmedValue !== emoji.fileName) {
      onFileNameChange(emoji.id, trimmedValue)
    }
    setIsEditing(false)
  }, [editValue, emoji.fileName, emoji.id, onFileNameChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur()
      } else if (e.key === 'Escape') {
        setEditValue(emoji.fileName)
        setIsEditing(false)
      }
    },
    [handleBlur, emoji.fileName],
  )

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border-2 bg-white transition-all ${
        emoji.isSelected
          ? 'border-blue-500 shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div
        className="relative cursor-pointer"
        onClick={() => onToggleSelect(emoji.id)}
      >
        <img
          src={emoji.objectUrl}
          alt={emoji.fileName}
          className="aspect-square w-full object-cover"
        />
        <div className="absolute left-2 top-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
              emoji.isSelected
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 bg-white'
            }`}
          >
            {emoji.isSelected && (
              <svg
                className="h-3 w-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDownload(emoji)
            }}
            className="rounded bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            下载
          </button>
        </div>
      </div>
      <div className="border-t border-gray-100 p-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full rounded border border-blue-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="cursor-pointer truncate text-center text-sm text-gray-700 hover:text-blue-600"
            title="双击编辑文件名"
          >
            {emoji.fileName}
          </div>
        )}
      </div>
    </div>
  )
}
