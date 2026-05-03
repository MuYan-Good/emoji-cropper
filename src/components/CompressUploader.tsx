import { useCallback, useRef } from 'react'
import { COMPRESS_SUPPORTED_INPUT_TYPES } from '../utils/constants'

export interface CompressUploaderProps {
  onFilesAdd: (files: File[]) => void
  disabled?: boolean
}

const FORMAT_TAGS = ['PNG', 'JPEG', 'GIF']

export function CompressUploader({ onFilesAdd, disabled = false }: CompressUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onFilesAdd(files)
      }
    },
    [disabled, onFilesAdd],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }, [disabled])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFilesAdd(files)
        e.target.value = ''
      }
    },
    [onFilesAdd],
  )

  return (
    <div
      data-testid="dropzone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      style={{
        border: '2px dashed var(--gray-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 32px',
        textAlign: 'center',
        background: disabled ? 'var(--gray-50)' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'var(--primary-400)'
          e.currentTarget.style.background = 'var(--primary-50)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'var(--gray-300)'
          e.currentTarget.style.background = 'white'
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={COMPRESS_SUPPORTED_INPUT_TYPES.join(',')}
        multiple
        data-testid="file-input"
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={disabled}
      />

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
        📁
      </div>

      <p
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--gray-700)',
          marginBottom: '8px',
        }}
      >
        拖拽图片到这里，或点击选择文件
      </p>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--gray-500)',
          marginBottom: '20px',
        }}
      >
        支持 PNG、JPEG、GIF 格式
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {FORMAT_TAGS.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '4px 12px',
              background: 'var(--gray-100)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--gray-600)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
