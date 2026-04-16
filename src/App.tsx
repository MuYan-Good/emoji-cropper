import { useState, useCallback, useEffect } from 'react'
import { ImageUploader } from './components/ImageUploader'
import { GridPreview } from './components/GridPreview'
import { CropControls } from './components/CropControls'
import { EmojiGrid } from './components/EmojiGrid'
import { ToastContainer, useToast } from './components/Toast'
import { useSpriteCrop } from './hooks/useSpriteCrop'
import { useEmojiGrid } from './hooks/useEmojiGrid'
import { useExport } from './hooks/useExport'
import type { GridConfig, EmojiItem, OutputSize } from './types/image'
import type { ImageInfo } from './hooks/useImageUpload'
import { DEFAULT_OUTPUT_SIZE } from './utils/constants'
import './App.css'

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [config, setConfig] = useState<GridConfig>({ rows: 4, cols: 4 })
  const [outputSize, setOutputSize] = useState<OutputSize>(DEFAULT_OUTPUT_SIZE)
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true)

  const { results, isCropping, error: cropError, crop, reset: resetCrop } = useSpriteCrop()
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
  const { isExporting, error: exportError, downloadOne, downloadSelected } = useExport()
  const { toasts, removeToast, success, error: showError } = useToast()

  useEffect(() => {
    if (results.length > 0) {
      setEmojisFromResults(results)
      success(`成功裁剪 ${results.length} 个表情`)
    }
  }, [results, setEmojisFromResults, success])

  useEffect(() => {
    if (cropError) {
      showError(cropError)
    }
  }, [cropError, showError])

  useEffect(() => {
    if (exportError) {
      showError(exportError)
    }
  }, [exportError, showError])

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
      showError('请先选择要下载的表情')
      return
    }
    downloadSelected(selected)
    success(`正在打包 ${selected.length} 个表情...`)
  }, [getSelectedEmojis, downloadSelected, showError, success])

  return (
    <div style={{ minHeight: '100vh' }}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: 'var(--shadow-primary)',
              }}
            >
              ✂️
            </div>
            <div>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                表情包裁剪工具
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                上传雪碧图，一键裁剪为单个表情
              </p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--gray-100)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--gray-600)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gray-100)'
            }}
          >
            <span>⭐</span>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
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
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'white',
          borderTop: '1px solid var(--gray-200)',
          padding: '24px',
          marginTop: '48px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
            表情包裁剪工具 · 纯前端处理，图片不会上传到服务器
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
