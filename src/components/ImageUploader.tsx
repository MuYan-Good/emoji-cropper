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
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">已上传图片</span>
          <button
            type="button"
            onClick={() => onImageLoad(null, null)}
            className="text-sm text-red-500 hover:text-red-600"
          >
            重新上传
          </button>
        </div>
        <img
          src={currentImage.src}
          alt="Uploaded sprite"
          className="max-h-64 rounded-lg border border-gray-100"
        />
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${isDragReject ? 'border-red-500 bg-red-50' : ''} ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-gray-500">
          {isDragActive ? (
            <p>放开以上传图片</p>
          ) : (
            <div>
              <p className="mb-2 text-lg">拖拽图片到这里，或点击上传</p>
              <p className="text-sm">支持 PNG、GIF 格式，最大 10MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
