import type { GridConfig } from '../types/image'

interface GridPreviewProps {
  image: HTMLImageElement | null
  config: GridConfig
}

export function GridPreview({ image, config }: GridPreviewProps) {
  if (!image) {
    return null
  }

  const cellWidth = image.width / config.cols
  const cellHeight = image.height / config.rows

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-700">网格预览</h3>
      <div className="relative inline-block">
        <img
          src={image.src}
          alt="Sprite preview"
          className="max-w-full rounded-lg border border-gray-100"
          style={{ maxHeight: '400px' }}
        />
        <svg
          className="pointer-events-none absolute left-0 top-0 h-full w-full"
          viewBox={`0 0 ${image.width} ${image.height}`}
          preserveAspectRatio="none"
        >
          {Array.from({ length: config.rows + 1 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * cellHeight}
              x2={image.width}
              y2={i * cellHeight}
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth={Math.max(1, image.width / 200)}
            />
          ))}
          {Array.from({ length: config.cols + 1 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * cellWidth}
              y1={0}
              x2={i * cellWidth}
              y2={image.height}
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth={Math.max(1, image.width / 200)}
            />
          ))}
        </svg>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        图片尺寸: {image.width} × {image.height}px | 单元格: {Math.round(cellWidth)} × {Math.round(cellHeight)}px
      </p>
    </div>
  )
}
