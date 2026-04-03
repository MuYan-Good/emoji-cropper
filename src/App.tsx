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
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">表情包雪碧图裁剪工具</h1>
          <p className="mt-2 text-sm text-gray-500">上传雪碧图，一键裁剪为单个表情</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ImageUploader
              onImageLoad={handleImageLoad}
              currentImage={image}
              isLoading={false}
            />

            {image && <GridPreview image={image} config={config} />}
          </div>

          <div>
            <CropControls
              config={config}
              outputSize={outputSize}
              imageSize={imageInfo ? { width: imageInfo.width, height: imageInfo.height } : undefined}
              aspectRatioLocked={aspectRatioLocked}
              onConfigChange={setConfig}
              onOutputSizeChange={setOutputSize}
              onAspectRatioLockChange={setAspectRatioLocked}
              onCrop={handleCrop}
              disabled={!image}
              isCropping={isCropping}
            />

            {imageInfo && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">
                <p>
                  图片尺寸: {imageInfo.width} × {imageInfo.height}
                </p>
                <p>
                  文件名: {imageInfo.fileName}
                </p>
              </div>
            )}
          </div>
        </div>

        {isCropping && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              正在裁剪中，请稍候...
            </div>
          </div>
        )}

        {isExporting && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
            正在处理下载...
          </div>
        )}

        <div className="mt-6">
          <EmojiGrid
            emojis={emojis}
            onFileNameChange={updateFileName}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onDownload={handleDownloadOne}
            onDownloadSelected={handleDownloadSelected}
          />
        </div>

        {!image && (
          <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">上传图片开始裁剪</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
