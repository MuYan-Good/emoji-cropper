import { useCallback } from 'react'
import { EmojiCard } from './EmojiCard'
import type { EmojiItem } from '../types/image'

interface EmojiGridProps {
  emojis: EmojiItem[]
  onFileNameChange: (id: string, fileName: string) => void
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onDownload: (emoji: EmojiItem) => void
  onDownloadSelected: () => void
}

export function EmojiGrid({
  emojis,
  onFileNameChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDownload,
  onDownloadSelected,
}: EmojiGridProps) {
  const selectedCount = emojis.filter((e) => e.isSelected).length

  const handleDownloadSelected = useCallback(() => {
    onDownloadSelected()
  }, [onDownloadSelected])

  if (emojis.length === 0) {
    return null
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--gray-100)',
        animation: 'fadeInUp 0.6s ease-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '2px solid var(--gray-100)',
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
              fontSize: '22px',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            🎯
          </div>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--gray-800)',
                marginBottom: '2px',
              }}
            >
              裁剪结果
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
              共 {emojis.length} 个表情
              {selectedCount > 0 && (
                <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                  {' '}
                  · 已选择 {selectedCount} 个
                </span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onSelectAll}
            style={{
              padding: '10px 16px',
              background: 'var(--gray-100)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--gray-600)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gray-100)'
            }}
          >
            全选
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            style={{
              padding: '10px 16px',
              background: 'var(--gray-100)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--gray-600)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gray-100)'
            }}
          >
            取消全选
          </button>
          <button
            type="button"
            onClick={handleDownloadSelected}
            disabled={selectedCount === 0}
            style={{
              padding: '10px 20px',
              background:
                selectedCount === 0
                  ? 'var(--gray-200)'
                  : 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '13px',
              fontWeight: 700,
              color: selectedCount === 0 ? 'var(--gray-400)' : 'white',
              cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
              boxShadow: selectedCount === 0 ? 'none' : 'var(--shadow-primary)',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              if (selectedCount > 0) {
                e.currentTarget.style.boxShadow = 'var(--shadow-primary)'
              }
            }}
          >
            <span>📦</span>
            <span>下载选中 ({selectedCount})</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '16px',
        }}
      >
        {emojis.map((emoji, index) => (
          <div
            key={emoji.id}
            style={{
              animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
            }}
          >
            <EmojiCard
              emoji={emoji}
              onFileNameChange={onFileNameChange}
              onToggleSelect={onToggleSelect}
              onDownload={onDownload}
            />
          </div>
        ))}
      </div>

      {/* Footer Hint */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--primary-50)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '16px' }}>💡</span>
        <span style={{ fontSize: '13px', color: 'var(--primary-700)' }}>
          双击文件名可编辑，点击图片切换选中状态，悬停图片可下载
        </span>
      </div>
    </div>
  )
}
