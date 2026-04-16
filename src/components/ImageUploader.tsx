import { useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import type { ImageInfo } from '../hooks/useImageUpload'

interface ImageUploaderProps {
  onImageLoad: (image: HTMLImageElement | null, info: ImageInfo | null) => void
  currentImage: HTMLImageElement | null
  isLoading?: boolean
}

export function ImageUploader({ onImageLoad, currentImage, isLoading }: ImageUploaderProps) {
  const objectUrlRef = useRef<string | null>(null)

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      revokeObjectUrl()
    }
  }, [revokeObjectUrl])

  const handleFile = useCallback(
    async (file: File) => {
      revokeObjectUrl()

      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      objectUrlRef.current = objectUrl

      img.onload = () => {
        const info: ImageInfo = {
          width: img.width,
          height: img.height,
          type: file.type === 'image/gif' ? 'gif' : 'png',
          fileName: file.name,
          fileSize: file.size,
        }
        onImageLoad(img, info)
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        objectUrlRef.current = null
        onImageLoad(null, null)
      }

      img.src = objectUrl
    },
    [onImageLoad, revokeObjectUrl],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isLoading,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0])
      }
    },
  })

  if (currentImage) {
    return (
      <div 
        className="image-uploader-preview"
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--gray-100)',
        }}
      >
        <div 
          className="preview-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                background: 'var(--success-500)',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>
              已上传图片
            </span>
          </div>
          <button
            type="button"
            onClick={() => onImageLoad(null, null)}
            style={{
              fontSize: '13px',
              color: 'var(--error-500)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--error-50)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            重新上传
          </button>
        </div>
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--gray-100)',
          }}
        >
          <img
            src={currentImage.src}
            alt="Uploaded sprite"
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      style={{
        background: isDragActive 
          ? 'linear-gradient(135deg, var(--primary-50), var(--primary-100))'
          : 'white',
        border: `2px dashed ${isDragActive ? 'var(--primary-500)' : isDragReject ? 'var(--error-500)' : 'var(--gray-300)'}`,
        borderRadius: 'var(--radius-2xl)',
        padding: '48px 32px',
        textAlign: 'center',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
        transition: 'all var(--transition-normal)',
        boxShadow: isDragActive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      }}
    >
      <input {...getInputProps()} />
      
      <div
        style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          background: isDragActive 
            ? 'linear-gradient(135deg, var(--primary-400), var(--primary-500))'
            : 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          transition: 'all var(--transition-normal)',
          transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {isDragActive ? '📥' : '📁'}
      </div>
      
      <div
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: isDragActive ? 'var(--primary-700)' : 'var(--gray-700)',
          marginBottom: '8px',
          transition: 'color var(--transition-fast)',
        }}
      >
        {isDragActive ? '放开以上传图片' : '拖拽图片到这里，或点击选择文件'}
      </div>
      
      <div style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
        支持 PNG、GIF 格式，最大 10MB
      </div>
      
      {!isDragActive && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              background: 'var(--gray-100)',
              color: 'var(--gray-500)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            PNG
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              background: 'var(--gray-100)',
              color: 'var(--gray-500)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            GIF
          </span>
        </div>
      )}
    </div>
  )
}
