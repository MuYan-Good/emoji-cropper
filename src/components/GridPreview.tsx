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
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
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
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          🔍
        </div>
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-800)' }}>
          网格预览
        </span>
      </div>

      {/* Image with Grid */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--gray-100)',
        }}
      >
        <img
          src={image.src}
          alt="Sprite preview"
          style={{
            width: '100%',
            maxHeight: '350px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
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
              stroke="rgba(20, 184, 166, 0.8)"
              strokeWidth={Math.max(2, image.width / 150)}
              strokeDasharray="8,4"
            />
          ))}
          {Array.from({ length: config.cols + 1 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * cellWidth}
              y1={0}
              x2={i * cellWidth}
              y2={image.height}
              stroke="rgba(20, 184, 166, 0.8)"
              strokeWidth={Math.max(2, image.width / 150)}
              strokeDasharray="8,4"
            />
          ))}
        </svg>
      </div>

      {/* Info */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'var(--primary-50)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>📐</span>
          <span style={{ fontSize: '13px', color: 'var(--primary-800)' }}>
            图片: {image.width}×{image.height}px
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🔲</span>
          <span style={{ fontSize: '13px', color: 'var(--primary-800)' }}>
            单元格: {Math.round(cellWidth)}×{Math.round(cellHeight)}px
          </span>
        </div>
      </div>
    </div>
  )
}
