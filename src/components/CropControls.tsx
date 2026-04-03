import { useState, useEffect, useCallback } from 'react'
import type { GridConfig, OutputSize } from '../types/image'

interface CropControlsProps {
  config: GridConfig
  outputSize: OutputSize
  imageSize?: { width: number; height: number }
  aspectRatioLocked: boolean
  onConfigChange: (config: GridConfig) => void
  onOutputSizeChange: (size: OutputSize) => void
  onAspectRatioLockChange: (locked: boolean) => void
  onCrop: () => void
  disabled?: boolean
  isCropping?: boolean
}

const PRESET_SIZES: OutputSize[] = [
  { width: 120, height: 120 },
  { width: 240, height: 240 },
  { width: 512, height: 512 },
]

const MAX_GRID = 20

export function CropControls({
  config,
  outputSize,
  imageSize,
  aspectRatioLocked,
  onConfigChange,
  onOutputSizeChange,
  onAspectRatioLockChange,
  onCrop,
  disabled,
  isCropping,
}: CropControlsProps) {
  const [localRows, setLocalRows] = useState(config.rows.toString())
  const [localCols, setLocalCols] = useState(config.cols.toString())
  const [localWidth, setLocalWidth] = useState(outputSize.width.toString())
  const [localHeight, setLocalHeight] = useState(outputSize.height.toString())
  const [rowsError, setRowsError] = useState<string | null>(null)
  const [colsError, setColsError] = useState<string | null>(null)
  const [widthError, setWidthError] = useState<string | null>(null)
  const [heightError, setHeightError] = useState<string | null>(null)

  const cellAspectRatio = imageSize
    ? imageSize.width / config.cols / (imageSize.height / config.rows)
    : 1

  useEffect(() => {
    setLocalRows(config.rows.toString())
    setLocalCols(config.cols.toString())
  }, [config])

  useEffect(() => {
    setLocalWidth(outputSize.width.toString())
    setLocalHeight(outputSize.height.toString())
  }, [outputSize])

  const handleRowsBlur = useCallback(() => {
    const value = parseInt(localRows, 10)
    if (isNaN(value) || value <= 0) {
      setRowsError('请输入大于 0 的数字')
      return
    }
    if (value > MAX_GRID) {
      setRowsError(`最大值为 ${MAX_GRID}`)
      return
    }
    setRowsError(null)
    onConfigChange({ ...config, rows: value })
  }, [localRows, config, onConfigChange])

  const handleColsBlur = useCallback(() => {
    const value = parseInt(localCols, 10)
    if (isNaN(value) || value <= 0) {
      setColsError('请输入大于 0 的数字')
      return
    }
    if (value > MAX_GRID) {
      setColsError(`最大值为 ${MAX_GRID}`)
      return
    }
    setColsError(null)
    onConfigChange({ ...config, cols: value })
  }, [localCols, config, onConfigChange])

  const handleWidthBlur = useCallback(() => {
    const value = parseInt(localWidth, 10)
    if (isNaN(value) || value <= 0) {
      setWidthError('请输入大于 0 的数字')
      return
    }
    setWidthError(null)
    if (aspectRatioLocked) {
      const newHeight = Math.round(value / cellAspectRatio)
      onOutputSizeChange({ width: value, height: newHeight })
    } else {
      onOutputSizeChange({ ...outputSize, width: value })
    }
  }, [localWidth, outputSize, aspectRatioLocked, cellAspectRatio, onOutputSizeChange])

  const handleHeightBlur = useCallback(() => {
    const value = parseInt(localHeight, 10)
    if (isNaN(value) || value <= 0) {
      setHeightError('请输入大于 0 的数字')
      return
    }
    setHeightError(null)
    if (aspectRatioLocked) {
      const newWidth = Math.round(value * cellAspectRatio)
      onOutputSizeChange({ width: newWidth, height: value })
    } else {
      onOutputSizeChange({ ...outputSize, height: value })
    }
  }, [localHeight, outputSize, aspectRatioLocked, cellAspectRatio, onOutputSizeChange])

  const handleWidthChange = useCallback(
    (value: string) => {
      setLocalWidth(value)
      if (aspectRatioLocked) {
        const numValue = parseInt(value, 10)
        if (!isNaN(numValue) && numValue > 0) {
          const newHeight = Math.round(numValue / cellAspectRatio)
          setLocalHeight(newHeight.toString())
        }
      }
    },
    [aspectRatioLocked, cellAspectRatio],
  )

  const handleHeightChange = useCallback(
    (value: string) => {
      setLocalHeight(value)
      if (aspectRatioLocked) {
        const numValue = parseInt(value, 10)
        if (!isNaN(numValue) && numValue > 0) {
          const newWidth = Math.round(numValue * cellAspectRatio)
          setLocalWidth(newWidth.toString())
        }
      }
    },
    [aspectRatioLocked, cellAspectRatio],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !disabled &&
        !isCropping &&
        !rowsError &&
        !colsError &&
        !widthError &&
        !heightError
      ) {
        onCrop()
      }
    },
    [disabled, isCropping, rowsError, colsError, widthError, heightError, onCrop],
  )

  const totalEmojis = config.rows * config.cols

  let sizeWarning: string | null = null
  if (imageSize) {
    const cellWidth = imageSize.width / config.cols
    const cellHeight = imageSize.height / config.rows
    const isWidthInteger = Number.isInteger(cellWidth)
    const isHeightInteger = Number.isInteger(cellHeight)

    if (!isWidthInteger || !isHeightInteger) {
      sizeWarning = `图片尺寸 (${imageSize.width}×${imageSize.height}) 不能被 ${config.rows}行×${config.cols}列 整除，裁剪结果可能有偏差`
    }
  }

  const hasError = rowsError || colsError || widthError || heightError

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4" onKeyDown={handleKeyDown}>
      <h3 className="mb-4 text-sm font-medium text-gray-700">裁剪设置</h3>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-500">行数</label>
          <input
            type="number"
            min={1}
            max={MAX_GRID}
            value={localRows}
            onChange={(e) => setLocalRows(e.target.value)}
            onBlur={handleRowsBlur}
            disabled={disabled}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
              rowsError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {rowsError && <p className="mt-1 text-xs text-red-500">{rowsError}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">列数</label>
          <input
            type="number"
            min={1}
            max={MAX_GRID}
            value={localCols}
            onChange={(e) => setLocalCols(e.target.value)}
            onBlur={handleColsBlur}
            disabled={disabled}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
              colsError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {colsError && <p className="mt-1 text-xs text-red-500">{colsError}</p>}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-gray-500">输出尺寸</label>
          <button
            type="button"
            onClick={() => onAspectRatioLockChange(!aspectRatioLocked)}
            disabled={disabled}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
              aspectRatioLocked
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } disabled:opacity-50`}
            title={aspectRatioLocked ? '点击解锁宽高比' : '点击锁定宽高比'}
          >
            {aspectRatioLocked ? (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" />
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0l10 10a1 1 0 01-1.414 1.414l-10-10a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {aspectRatioLocked ? '已锁定' : '未锁定'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              min={1}
              value={localWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              onBlur={handleWidthBlur}
              disabled={disabled}
              placeholder="宽度"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
                widthError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {widthError && <p className="mt-1 text-xs text-red-500">{widthError}</p>}
          </div>
          <div>
            <input
              type="number"
              min={1}
              value={localHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              onBlur={handleHeightBlur}
              disabled={disabled}
              placeholder="高度"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
                heightError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {heightError && <p className="mt-1 text-xs text-red-500">{heightError}</p>}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESET_SIZES.map((size) => (
            <button
              key={`${size.width}x${size.height}`}
              type="button"
              onClick={() => onOutputSizeChange(size)}
              disabled={disabled}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                outputSize.width === size.width && outputSize.height === size.height
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {size.width}×{size.height}
            </button>
          ))}
        </div>
      </div>

      {sizeWarning && (
        <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
          ⚠️ {sizeWarning}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>将生成 {totalEmojis} 个表情</span>
        <span className="text-xs text-gray-400">
          输出: {outputSize.width}×{outputSize.height}
        </span>
      </div>

      <button
        type="button"
        onClick={onCrop}
        disabled={disabled || isCropping || !!hasError}
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isCropping ? '裁剪中...' : '一键裁剪'}
      </button>

      {!disabled && <p className="mt-2 text-center text-xs text-gray-400">按 Enter 键快速裁剪</p>}
    </div>
  )
}
