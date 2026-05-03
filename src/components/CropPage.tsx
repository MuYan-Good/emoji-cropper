import { useState, useCallback, useEffect } from 'react'
import { ImageUploader } from './ImageUploader'
import { GridPreview } from './GridPreview'
import { CropControls } from './CropControls'
import { EmojiGrid } from './EmojiGrid'
import { useSpriteCrop } from '../hooks/useSpriteCrop'
import { useEmojiGrid } from '../hooks/useEmojiGrid'
import { useExport } from '../hooks/useExport'
import type { GridConfig, EmojiItem, OutputSize } from '../types/image'
import type { ImageInfo } from '../hooks/useImageUpload'
import { DEFAULT_OUTPUT_SIZE } from '../utils/constants'

export function CropPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [config, setConfig] = useState<GridConfig>({ rows: 4, cols: 4 })
  const [outputSize, setOutputSize] = useState<OutputSize>(DEFAULT_OUTPUT_SIZE)
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true)

  const { results, isCropping, crop, reset: resetCrop } = useSpriteCrop()
  const {
    emojis,
    setEmojisFromResults,
    updateFileName,
    toggleSelect,
    selectAll,
    deselectAll,
    getSelectedEmojis,
    clearEmojis,
  } = useEmojiGrid()
  const { isExporting, downloadOne, downloadSelected } = useExport()

  useEffect(() => {
    if (results.length > 0) {
      setEmojisFromResults(results)
    }
  }, [results, setEmojisFromResults])

  const handleImageLoad = useCallback(
    (img: HTMLImageElement | null, info: ImageInfo | null) => {
      setImage(img)
      setImageInfo(info)
      resetCrop()
      clearEmojis()
    },
    [resetCrop, clearEmojis],
  )

  const handleCrop = useCallback(() => {
    crop(image, config, outputSize)
  }, [crop, image, config, outputSize])

  const handleDownloadOne = useCallback(
    (emoji: EmojiItem) => {
      downloadOne(emoji)
    },
    [downloadOne],
  )

  const handleDownloadSelected = useCallback(() => {
    const selected = getSelectedEmojis()
    if (selected.length === 0) {
      return
    }
    downloadSelected(selected)
  }, [getSelectedEmojis, downloadSelected])

  return (
    <>
      {/* Upload Section */}
      <section style={{ marginBottom: '32px' }}>
        <ImageUploader
          onImageLoad={handleImageLoad}
          currentImage={image}
          isLoading={false}
        />
      </section>

      {/* Grid and Controls Section */}
      {image && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
            animation: 'fadeInUp 0.5s ease-out',
          }}
        >
          <GridPreview image={image} config={config} />
          <CropControls
            config={config}
            outputSize={outputSize}
            imageSize={
              imageInfo ? { width: imageInfo.width, height: imageInfo.height } : undefined
            }
            aspectRatioLocked={aspectRatioLocked}
            onConfigChange={setConfig}
            onOutputSizeChange={setOutputSize}
            onAspectRatioLockChange={setAspectRatioLocked}
            onCrop={handleCrop}
            disabled={!image}
            isCropping={isCropping}
          />
        </section>
      )}

      {/* Loading State */}
      {isCropping && (
        <div
          style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid var(--primary-200)',
              borderTopColor: 'var(--primary-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--primary-700)' }}>
            正在裁剪中，请稍候...
          </span>
        </div>
      )}

      {/* Export Loading State */}
      {isExporting && (
        <div
          style={{
            background: 'var(--info-50)',
            border: '1px solid var(--info-200)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid var(--info-200)',
              borderTopColor: 'var(--info-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--info-700)' }}>
            正在处理下载...
          </span>
        </div>
      )}

      {/* Results Section */}
      <EmojiGrid
        emojis={emojis}
        onFileNameChange={updateFileName}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onDownload={handleDownloadOne}
        onDownloadSelected={handleDownloadSelected}
      />

      {/* Empty State */}
      {!image && emojis.length === 0 && (
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-2xl)',
            padding: '64px 32px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--gray-100)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}
          >
            🎨
          </div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--gray-800)',
              marginBottom: '8px',
            }}
          >
            上传图片开始裁剪你的表情包
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--gray-500)' }}>
            将雪碧图裁剪为单个表情，一键导出为 ZIP 文件
          </p>
        </div>
      )}
    </>
  )
}
