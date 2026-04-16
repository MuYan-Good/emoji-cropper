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

  const inputStyle = (error: string | null): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${error ? 'var(--error-500)' : 'var(--gray-200)'}`,
    borderRadius: 'var(--radius-lg)',
    fontSize: '15px',
    fontWeight: 600,
    textAlign: 'center',
    background: error ? 'var(--error-50)' : 'white',
    color: 'var(--gray-800)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  })

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--gray-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    display: 'block',
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--gray-100)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid var(--gray-100)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          ⚙️
        </div>
        <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-800)' }}>
          裁剪设置
        </span>
      </div>

      {/* Grid Config */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>网格配置</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <input
              type="number"
              min={1}
              max={MAX_GRID}
              value={localRows}
              onChange={(e) => setLocalRows(e.target.value)}
              onBlur={handleRowsBlur}
              disabled={disabled}
              style={inputStyle(rowsError)}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-400)'
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)'
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = rowsError ? 'var(--error-500)' : 'var(--gray-200)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '6px', textAlign: 'center' }}>
              行数
            </div>
            {rowsError && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--error-500)' }}>{rowsError}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              min={1}
              max={MAX_GRID}
              value={localCols}
              onChange={(e) => setLocalCols(e.target.value)}
              onBlur={handleColsBlur}
              disabled={disabled}
              style={inputStyle(colsError)}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-400)'
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)'
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = colsError ? 'var(--error-500)' : 'var(--gray-200)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '6px', textAlign: 'center' }}>
              列数
            </div>
            {colsError && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--error-500)' }}>{colsError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Output Size */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <label style={labelStyle}>输出尺寸</label>
          <button
            type="button"
            onClick={() => onAspectRatioLockChange(!aspectRatioLocked)}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              background: aspectRatioLocked ? 'var(--primary-100)' : 'var(--gray-100)',
              color: aspectRatioLocked ? 'var(--primary-700)' : 'var(--gray-600)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span>{aspectRatioLocked ? '🔒' : '🔓'}</span>
            <span>{aspectRatioLocked ? '已锁定' : '未锁定'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <input
              type="number"
              min={1}
              value={localWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              onBlur={handleWidthBlur}
              disabled={disabled}
              placeholder="宽度"
              style={inputStyle(widthError)}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-400)'
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)'
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = widthError ? 'var(--error-500)' : 'var(--gray-200)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '6px', textAlign: 'center' }}>
              宽度 (px)
            </div>
            {widthError && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--error-500)' }}>{widthError}</p>
            )}
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
              style={inputStyle(heightError)}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-400)'
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)'
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = heightError ? 'var(--error-500)' : 'var(--gray-200)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '6px', textAlign: 'center' }}>
              高度 (px)
            </div>
            {heightError && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--error-500)' }}>{heightError}</p>
            )}
          </div>
        </div>

        {/* Preset Sizes */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESET_SIZES.map((size) => (
            <button
              key={`${size.width}x${size.height}`}
              type="button"
              onClick={() => onOutputSizeChange(size)}
              disabled={disabled}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                background:
                  outputSize.width === size.width && outputSize.height === size.height
                    ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'
                    : 'var(--gray-100)',
                color:
                  outputSize.width === size.width && outputSize.height === size.height
                    ? 'white'
                    : 'var(--gray-600)',
                boxShadow:
                  outputSize.width === size.width && outputSize.height === size.height
                    ? 'var(--shadow-primary)'
                    : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              {size.width}×{size.height}
            </button>
          ))}
        </div>
      </div>

      {/* Warning */}
      {sizeWarning && (
        <div
          style={{
            background: 'var(--warning-50)',
            border: '1px solid var(--warning-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span style={{ fontSize: '13px', color: 'var(--warning-700)', lineHeight: 1.5 }}>{sizeWarning}</span>
        </div>
      )}

      {/* Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎯</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>
            将生成 {totalEmojis} 个表情
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
          输出: {outputSize.width}×{outputSize.height}px
        </span>
      </div>

      {/* Crop Button */}
      <button
        type="button"
        onClick={onCrop}
        disabled={disabled || isCropping || !!hasError}
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: 'var(--radius-xl)',
          border: 'none',
          fontSize: '16px',
          fontWeight: 700,
          cursor: disabled || isCropping || !!hasError ? 'not-allowed' : 'pointer',
          background:
            disabled || isCropping || !!hasError
              ? 'var(--gray-200)'
              : 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
          color: disabled || isCropping || !!hasError ? 'var(--gray-400)' : 'white',
          boxShadow: disabled || isCropping || !!hasError ? 'none' : 'var(--shadow-primary)',
          transition: 'all var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
        onMouseEnter={(e) => {
          if (!(disabled || isCropping || !!hasError)) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          if (!(disabled || isCropping || !!hasError)) {
            e.currentTarget.style.boxShadow = 'var(--shadow-primary)'
          }
        }}
      >
        {isCropping ? (
          <>
            <span
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid var(--gray-300)',
                borderTopColor: 'var(--gray-500)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>裁剪中...</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '20px' }}>✂️</span>
            <span>一键裁剪</span>
          </>
        )}
      </button>

      {!disabled && (
        <p
          style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--gray-400)',
          }}
        >
          按 Enter 键快速裁剪
        </p>
      )}
    </div>
  )
}
