import { useState, useCallback, useRef, useEffect } from 'react'
import type { EmojiItem } from '../types/image'

interface EmojiCardProps {
  emoji: EmojiItem
  onFileNameChange: (id: string, fileName: string) => void
  onToggleSelect: (id: string) => void
  onDownload: (emoji: EmojiItem) => void
}

export function EmojiCard({
  emoji,
  onFileNameChange,
  onToggleSelect,
  onDownload,
}: EmojiCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(emoji.fileName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
    setEditValue(emoji.fileName)
  }, [emoji.fileName])

  const handleBlur = useCallback(() => {
    const trimmedValue = editValue.trim()
    if (trimmedValue && trimmedValue !== emoji.fileName) {
      onFileNameChange(emoji.id, trimmedValue)
    }
    setIsEditing(false)
  }, [editValue, emoji.fileName, emoji.id, onFileNameChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur()
      } else if (e.key === 'Escape') {
        setEditValue(emoji.fileName)
        setIsEditing(false)
      }
    },
    [handleBlur, emoji.fileName],
  )

  return (
    <div
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: `2px solid ${emoji.isSelected ? 'var(--primary-500)' : 'var(--gray-200)'}`,
        boxShadow: emoji.isSelected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
        transform: emoji.isSelected ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        if (!emoji.isSelected) {
          e.currentTarget.style.borderColor = 'var(--primary-300)'
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        }
      }}
      onMouseLeave={(e) => {
        if (!emoji.isSelected) {
          e.currentTarget.style.borderColor = 'var(--gray-200)'
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        }
      }}
    >
      {/* Checkbox */}
      <div
        onClick={() => onToggleSelect(emoji.id)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10,
          width: '24px',
          height: '24px',
          borderRadius: 'var(--radius-md)',
          background: emoji.isSelected
            ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'
            : 'white',
          border: `2px solid ${emoji.isSelected ? 'var(--primary-500)' : 'var(--gray-300)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: emoji.isSelected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
          transition: 'all var(--transition-fast)',
        }}
      >
        {emoji.isSelected && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Image Container */}
      <div
        onClick={() => onToggleSelect(emoji.id)}
        style={{
          position: 'relative',
          aspectRatio: '1',
          background: 'var(--gray-50)',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <img
          src={emoji.objectUrl}
          alt={emoji.fileName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Hover Overlay with Download Button */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0'
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDownload(emoji)
            }}
            style={{
              padding: '10px 18px',
              background: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--gray-700)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }}
          >
            <span>⬇️</span>
            <span>下载</span>
          </button>
        </div>
      </div>

      {/* File Name */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid var(--gray-100)',
          background: 'white',
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '2px solid var(--primary-500)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              textAlign: 'center',
              outline: 'none',
              boxShadow: '0 0 0 3px var(--primary-100)',
            }}
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--gray-700)',
              textAlign: 'center',
              cursor: 'pointer',
              padding: '8px 4px',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title="双击编辑文件名"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-50)'
              e.currentTarget.style.color = 'var(--primary-700)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--gray-700)'
            }}
          >
            {emoji.fileName}
          </div>
        )}
      </div>
    </div>
  )
}
