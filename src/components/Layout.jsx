import React from 'react'

const styles = `
  .layout-shell {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .layout-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .layout-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px 32px;
    width: 100%;
    box-sizing: border-box;
  }

  /* 태블릿 (768px 이상) */
  @media (min-width: 768px) {
    .layout-shell {
      max-width: 640px;
      margin: 0 auto;
      box-shadow: 0 0 40px rgba(123,97,255,0.08);
    }
    .layout-header {
      padding: 18px 32px;
    }
    .layout-body {
      padding: 32px 32px 40px;
    }
  }

  /* 데스크탑 (1024px 이상) */
  @media (min-width: 1024px) {
    body {
      background: var(--bg);
    }
    .layout-shell {
      max-width: 720px;
      margin: 32px auto;
      min-height: calc(100vh - 64px);
      border-radius: 20px;
      box-shadow: 0 8px 48px rgba(123,97,255,0.12);
    }
    .layout-header {
      border-radius: 20px 20px 0 0;
      padding: 20px 40px;
    }
    .layout-body {
      padding: 36px 40px 48px;
      border-radius: 0 0 20px 20px;
    }
  }
`

export default function Layout({ children, showBack, onBack, step, total }) {
  return (
    <>
      <style>{styles}</style>
      <div className="layout-shell">
        <div className="layout-header">
          {showBack && (
            <button
              onClick={onBack}
              style={{
                marginRight: 12, background: 'none', border: 'none',
                fontSize: 22, color: 'var(--text-sub)', cursor: 'pointer',
                padding: '0 4px', lineHeight: 1,
              }}
            >←</button>
          )}
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)', letterSpacing: '-0.3px' }}>
            아맘때
          </span>
          {step && (
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-hint)', fontWeight: 500 }}>
              {step} / {total}
            </span>
          )}
        </div>
        <div className="layout-body">{children}</div>
      </div>
    </>
  )
}
