import { memo, useCallback } from 'react'
import type { CompressOptions } from '../types/compress'
import { COMPRESS_SCALE_PRESETS } from '../utils/constants'

interface CompressControlsProps {
  options: CompressOptions
  previewBlob: Blob | null
  previewFileSize: number
  isPreviewLoading: boolean
  originalFileSize: number
  originalSize: { width: number; height: number }
  onOptionsChange: (partial: Partial<CompressOptions>) => void
  onCompressAll: () => void
  isCompressing: boolean
  hasFiles: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const CompressControls = memo(function CompressControls({
  options,
  previewBlob,
  previewFileSize,
  isPreviewLoading: _isPreviewLoading,
  originalFileSize,
  originalSize,
  onOptionsChange,
  onCompressAll,
  isCompressing,
  hasFiles,
}: CompressControlsProps) {
  const isQualityDisabled = options.format === 'png'
  const hasPreview = previewBlob !== null

  const handleFormatChange = useCallback(
    (format: 'png' | 'jpeg') => {
      onOptionsChange({ format })
    },
    [onOptionsChange],
  )

  const handleQualityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onOptionsChange({ quality: Number(e.target.value) })
    },
    [onOptionsChange],
  )

  const handleScalePreset = useCallback(
    (percent: number) => {
      onOptionsChange({ scalePercent: percent })
    },
    [onOptionsChange],
  )

  const handleAspectRatioToggle = useCallback(() => {
    onOptionsChange({ aspectRatioLocked: !options.aspectRatioLocked })
  }, [onOptionsChange, options.aspectRatioLocked])

  const compressionRate = hasPreview && originalFileSize > 0
    ? Math.round(((originalFileSize - previewFileSize) / originalFileSize) * 100)
    : 0

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--gray-100)',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--gray-800)',
          marginBottom: '20px',
        }}
      >
        压缩设置
      </h3>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px', display: 'block' }}>
          输出格式
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleFormatChange('png')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: options.format === 'png' ? 'var(--primary-500)' : 'var(--gray-100)',
              color: options.format === 'png' ? 'white' : 'var(--gray-600)',
            }}
          >
            PNG
          </button>
          <button
            type="button"
            onClick={() => handleFormatChange('jpeg')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: options.format === 'jpeg' ? 'var(--primary-500)' : 'var(--gray-100)',
              color: options.format === 'jpeg' ? 'white' : 'var(--gray-600)',
            }}
          >
            JPEG
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px', display: 'block' }}>
          质量 {options.quality}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={options.quality}
          onChange={handleQualityChange}
          disabled={isQualityDisabled}
          role="slider"
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: isQualityDisabled ? 'var(--gray-200)' : 'var(--primary-200)',
            outline: 'none',
            cursor: isQualityDisabled ? 'not-allowed' : 'pointer',
            opacity: isQualityDisabled ? 0.5 : 1,
          }}
        />
        {isQualityDisabled && (
          <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>
            PNG 为无损格式，无法调整质量
          </p>
        )}
      </div>

      {hasPreview && (
        <div
          style={{
            background: 'var(--primary-50)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary-700)', marginBottom: '8px' }}>
            预览效果
          </p>
          <p style={{ fontSize: '13px', color: 'var(--primary-600)' }}>
            {formatFileSize(originalFileSize)} → {formatFileSize(previewFileSize)}
            {compressionRate > 0 && (
              <span style={{ color: 'var(--success-600)', fontWeight: 600 }}>
                {' '}节省 {compressionRate}%
              </span>
            )}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px', display: 'block' }}>
          输出尺寸
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {COMPRESS_SCALE_PRESETS.map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => handleScalePreset(percent)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: options.scalePercent === percent ? 'var(--primary-500)' : 'var(--gray-300)',
                background: options.scalePercent === percent ? 'var(--primary-50)' : 'white',
                color: options.scalePercent === percent ? 'var(--primary-600)' : 'var(--gray-600)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {percent}%
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            value={originalSize.width}
            readOnly
            placeholder="宽度"
            style={{
              width: '100px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-300)',
              fontSize: '13px',
              background: 'var(--gray-50)',
            }}
          />
          <span style={{ color: 'var(--gray-400)' }}>×</span>
          <input
            type="number"
            value={originalSize.height}
            readOnly
            placeholder="高度"
            style={{
              width: '100px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-300)',
              fontSize: '13px',
              background: 'var(--gray-50)',
            }}
          />
          <button
            type="button"
            onClick={handleAspectRatioToggle}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: options.aspectRatioLocked ? 'var(--primary-100)' : 'var(--gray-100)',
              color: options.aspectRatioLocked ? 'var(--primary-600)' : 'var(--gray-600)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {options.aspectRatioLocked ? '🔗' : '🔓'} 锁定宽高比
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onCompressAll}
        disabled={!hasFiles || isCompressing}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 'var(--radius-lg)',
          border: 'none',
          background: hasFiles && !isCompressing ? 'var(--primary-500)' : 'var(--gray-200)',
          color: hasFiles && !isCompressing ? 'white' : 'var(--gray-400)',
          fontSize: '15px',
          fontWeight: 700,
          cursor: hasFiles && !isCompressing ? 'pointer' : 'not-allowed',
          transition: 'all var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {isCompressing ? (
          <>
            <div style={{
              width: '18px',
              height: '18px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            压缩中...
          </>
        ) : (
          '一键压缩'
        )}
      </button>
    </div>
  )
})
