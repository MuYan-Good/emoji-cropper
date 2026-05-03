import { memo, useCallback } from 'react'
import { CompressItemCard } from './CompressItemCard'
import type { CompressItem } from '../types/compress'

interface CompressGridProps {
  items: CompressItem[]
  onRemove: (id: string) => void
  onDownload: (item: CompressItem) => void
  onDownloadAll: () => void
  isCompressing: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const CompressGrid = memo(function CompressGrid({
  items,
  onRemove,
  onDownload,
  onDownloadAll,
  isCompressing,
}: CompressGridProps) {
  const hasCompressedItems = items.some((item) => item.compressedBlob !== null)

  const handleDownloadAll = useCallback(() => {
    if (hasCompressedItems) {
      onDownloadAll()
    }
  }, [hasCompressedItems, onDownloadAll])

  const totalOriginalSize = items.reduce((sum, item) => sum + item.originalFileSize, 0)
  const totalCompressedSize = items.reduce(
    (sum, item) => sum + (item.compressedFileSize || 0),
    0,
  )
  const totalSavings = totalOriginalSize - totalCompressedSize

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--gray-800)',
              marginBottom: '4px',
            }}
          >
            已添加 {items.length} 张图片
          </h2>
          {totalCompressedSize > 0 && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--gray-600)',
              }}
            >
              总体积：{formatFileSize(totalOriginalSize)} → {formatFileSize(totalCompressedSize)}
              {totalSavings > 0 && (
                <span style={{ color: 'var(--success-600)', fontWeight: 600 }}>
                  {' '}
                  节省 {formatFileSize(totalSavings)}
                </span>
              )}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={!hasCompressedItems || isCompressing}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: hasCompressedItems && !isCompressing ? 'var(--primary-500)' : 'var(--gray-200)',
              color: hasCompressedItems && !isCompressing ? 'white' : 'var(--gray-400)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: hasCompressedItems && !isCompressing ? 'pointer' : 'not-allowed',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📦 批量下载 ZIP
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {items.map((item) => (
          <CompressItemCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  )
})
