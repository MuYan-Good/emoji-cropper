import { memo, useCallback } from 'react'
import type { CompressItem } from '../types/compress'

interface CompressItemCardProps {
  item: CompressItem
  onRemove: (id: string) => void
  onDownload: (item: CompressItem) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const CompressItemCard = memo(function CompressItemCard({
  item,
  onRemove,
  onDownload,
}: CompressItemCardProps) {
  const handleRemove = useCallback(() => {
    onRemove(item.id)
  }, [item.id, onRemove])

  const handleDownload = useCallback(() => {
    onDownload(item)
  }, [item, onDownload])

  const isGif = item.file.type === 'image/gif'
  const hasCompressed = item.compressedBlob !== null

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--gray-100)',
        position: 'relative',
        transition: 'all var(--transition-fast)',
      }}
    >
      <button
        type="button"
        onClick={handleRemove}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--gray-100)',
          color: 'var(--gray-500)',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--error-100)'
          e.currentTarget.style.color = 'var(--error-500)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--gray-100)'
          e.currentTarget.style.color = 'var(--gray-500)'
        }}
      >
        ×
      </button>

      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: 'var(--gray-100)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={item.objectUrl}
          alt={item.fileName}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />

        {isGif && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'var(--warning-100)',
              color: 'var(--warning-700)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            GIF
          </div>
        )}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--gray-800)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '4px',
          }}
        >
          {item.fileName}
        </p>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--gray-500)',
          }}
        >
          {item.originalWidth} × {item.originalHeight} · {formatFileSize(item.originalFileSize)}
        </p>
      </div>

      {isGif ? (
        <div
          style={{
            background: 'var(--gray-100)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--gray-500)',
          }}
        >
          不支持压缩
        </div>
      ) : hasCompressed ? (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--success-600)',
              }}
            >
              ✓ 已压缩
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--gray-600)',
            }}
          >
            {item.compressedWidth} × {item.compressedHeight} ·{' '}
            {formatFileSize(item.compressedFileSize)}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--success-600)',
              fontWeight: 600,
            }}
          >
            节省{' '}
            {Math.round(
              ((item.originalFileSize - item.compressedFileSize) / item.originalFileSize) * 100,
            )}
            %
          </p>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '8px',
              background: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-600)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--primary-500)'
            }}
          >
            下载
          </button>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--gray-100)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--gray-400)',
          }}
        >
          等待压缩
        </div>
      )}
    </div>
  )
})
