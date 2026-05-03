import { useCallback } from 'react'

type TabType = 'crop' | 'compress'

interface TabNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

interface TabConfig {
  key: TabType
  label: string
  icon: string
}

const TABS: TabConfig[] = [
  { key: 'crop', label: '裁剪工具', icon: '✂️' },
  { key: 'compress', label: '图片压缩', icon: '📦' },
]

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const handleClick = useCallback(
    (tab: TabType) => {
      onTabChange(tab)
    },
    [onTabChange],
  )

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        background: 'var(--gray-100)',
        padding: '4px',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleClick(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: isActive
                ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'
                : 'transparent',
              color: isActive ? 'white' : 'var(--gray-600)',
              boxShadow: isActive ? 'var(--shadow-primary)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--gray-200)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
