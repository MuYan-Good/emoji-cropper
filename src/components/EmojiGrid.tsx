import { useCallback } from 'react'
import { EmojiCard } from './EmojiCard'
import type { EmojiItem } from '../types/image'

interface EmojiGridProps {
  emojis: EmojiItem[]
  onFileNameChange: (id: string, fileName: string) => void
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onDownload: (emoji: EmojiItem) => void
  onDownloadSelected: () => void
}

export function EmojiGrid({
  emojis,
  onFileNameChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDownload,
  onDownloadSelected,
}: EmojiGridProps) {
  const selectedCount = emojis.filter((e) => e.isSelected).length

  const handleDownloadSelected = useCallback(() => {
    onDownloadSelected()
  }, [onDownloadSelected])

  if (emojis.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">
            裁剪结果 ({emojis.length} 个表情)
          </h3>
          <span className="text-sm text-gray-500">
            已选择 {selectedCount} 个
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            全选
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            取消全选
          </button>
          <button
            type="button"
            onClick={handleDownloadSelected}
            disabled={selectedCount === 0}
            className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            下载选中 ({selectedCount})
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {emojis.map((emoji) => (
          <EmojiCard
            key={emoji.id}
            emoji={emoji}
            onFileNameChange={onFileNameChange}
            onToggleSelect={onToggleSelect}
            onDownload={onDownload}
          />
        ))}
      </div>
      <div className="mt-3 text-center text-xs text-gray-400">
        双击文件名可编辑，点击图片切换选中状态
      </div>
    </div>
  )
}
