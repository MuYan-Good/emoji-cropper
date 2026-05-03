import { useCallback, useEffect } from 'react'
import { CompressUploader } from './CompressUploader'
import { CompressGrid } from './CompressGrid'
import { CompressControls } from './CompressControls'
import { useCompressImages } from '../hooks/useCompressImages'
import { useCompressPreview } from '../hooks/useCompressPreview'
import { downloadCompressItem, downloadCompressZip } from '../utils/zipExporter'
import type { CompressItem } from '../types/compress'

interface CompressPageProps {
  initialItems?: CompressItem[]
}

export function CompressPage({ initialItems: _initialItems }: CompressPageProps) {
  const {
    items,
    options,
    isCompressing,
    error,
    addFiles,
    removeFile,
    updateOptions,
    compressAll,
    clearAll: _clearAll,
  } = useCompressImages()

  const {
    previewBlob,
    previewFileSize,
    isPreviewLoading,
    updatePreview,
  } = useCompressPreview()

  const firstItem = items[0] || null

  useEffect(() => {
    if (firstItem && !firstItem.file.type.includes('gif')) {
      updatePreview(firstItem.file, options)
    } else {
      updatePreview(null, options)
    }
  }, [firstItem, options, updatePreview])

  const handleFilesAdd = useCallback(
    (files: File[]) => {
      addFiles(files)
    },
    [addFiles],
  )

  const handleRemove = useCallback(
    (id: string) => {
      removeFile(id)
    },
    [removeFile],
  )

  const handleDownload = useCallback((item: CompressItem) => {
    downloadCompressItem(item)
  }, [])

  const handleDownloadAll = useCallback(() => {
    downloadCompressZip(items)
  }, [items])

  const handleCompressAll = useCallback(() => {
    compressAll()
  }, [compressAll])

  const hasFiles = items.length > 0
  const firstItemOriginalSize = firstItem
    ? { width: firstItem.originalWidth, height: firstItem.originalHeight }
    : { width: 0, height: 0 }
  const firstItemOriginalFileSize = firstItem?.originalFileSize || 0

  return (
    <div>
      <section style={{ marginBottom: '32px' }}>
        <CompressUploader onFilesAdd={handleFilesAdd} disabled={isCompressing} />
      </section>

      {error && (
        <div
          style={{
            background: 'var(--error-50)',
            border: '1px solid var(--error-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            marginBottom: '24px',
            color: 'var(--error-700)',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {hasFiles && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <CompressGrid
            items={items}
            onRemove={handleRemove}
            onDownload={handleDownload}
            onDownloadAll={handleDownloadAll}
            isCompressing={isCompressing}
          />

          <CompressControls
            options={options}
            previewBlob={previewBlob}
            previewFileSize={previewFileSize}
            isPreviewLoading={isPreviewLoading}
            originalFileSize={firstItemOriginalFileSize}
            originalSize={firstItemOriginalSize}
            onOptionsChange={updateOptions}
            onCompressAll={handleCompressAll}
            isCompressing={isCompressing}
            hasFiles={hasFiles}
          />
        </section>
      )}

      {!hasFiles && (
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-2xl)',
            padding: '48px 32px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--gray-100)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            📦
          </div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--gray-700)',
              marginBottom: '8px',
            }}
          >
            还没有添加任何图片
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--gray-500)',
            }}
          >
            上传 PNG、JPEG 或 GIF 图片开始压缩
          </p>
        </div>
      )}
    </div>
  )
}
