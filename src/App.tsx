import { useState } from 'react'
import { TabNav } from './components/TabNav'
import { CropPage } from './components/CropPage'
import { CompressPage } from './components/CompressPage'
import { ToastContainer, useToast } from './components/Toast'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'crop' | 'compress'>('crop')
  const { toasts, removeToast } = useToast()

  return (
    <div style={{ minHeight: '100vh' }}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                fontSize: '24px',
                boxShadow: 'var(--shadow-primary)',
              }}
            >
              ✂️
            </div>
            <div>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                表情包工具箱
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                裁剪、压缩，一站搞定
              </p>
            </div>
          </div>
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {activeTab === 'crop' ? <CropPage /> : <CompressPage />}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'white',
          borderTop: '1px solid var(--gray-200)',
          padding: '24px',
          marginTop: '48px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
            表情包工具箱 · 纯前端处理，图片不会上传到服务器
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
