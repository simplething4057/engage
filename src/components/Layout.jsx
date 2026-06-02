/**
 * Layout.jsx — 공통 레이아웃 래퍼
 *
 * 역할:
 *   - 모든 페이지를 감싸는 흰색 카드 형태의 쉘을 제공
 *   - 상단 헤더(브랜드명, 뒤로가기 버튼, 진행 단계 표시)를 포함
 *   - 반응형 레이아웃 처리 (CSS 클래스 + 미디어 쿼리)
 *
 * Props:
 *   showBack — true이면 헤더 좌측에 뒤로가기(←) 버튼 표시
 *   onBack   — 뒤로가기 클릭 시 실행할 함수 (보통 navigate(-1))
 *   step     — 현재 단계 번호 (예: 1)
 *   total    — 전체 단계 수 (예: 3) → "1 / 3" 형태로 우측에 표시
 *
 * 반응형 브레이크포인트:
 *   ~767px   : 모바일 — 전체 너비, 여백 최소
 *   768px~   : 태블릿 — 최대 640px 중앙 정렬, 좌우 여백 확대
 *   1024px~  : 데스크탑 — 최대 720px, 위아래 32px 여백, 둥근 카드 모양
 *
 * 스타일 방식:
 *   CSS 클래스를 <style> 태그로 주입하는 방식 사용.
 *   미디어 쿼리가 필요해 인라인 스타일 대신 이 방식을 채택.
 */

import React from 'react'

// 반응형 레이아웃 CSS — 컴포넌트마다 <style> 태그로 주입됨
// 외부 CSS 파일 대신 이 방식을 사용해 컴포넌트 자급자족성 유지
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
    position: sticky; /* 스크롤 시 헤더 고정 */
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

  /* 데스크탑 (1024px 이상) — 카드 형태로 떠 있는 모양 */
  @media (min-width: 1024px) {
    body {
      background: var(--bg); /* 배경을 연한 보라색으로 — 카드가 떠 보이는 효과 */
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
      {/* CSS 주입 — React가 렌더링할 때마다 동일한 클래스명이므로 중복 적용되지 않음 */}
      <style>{styles}</style>
      <div className="layout-shell">
        <div className="layout-header">
          {/* 뒤로가기 버튼 — showBack prop이 true일 때만 렌더링 */}
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

          {/* 브랜드명 */}
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)', letterSpacing: '-0.3px' }}>
            아맘때
          </span>

          {/* 진행 단계 표시 (예: "1 / 3") — step prop이 있을 때만 렌더링 */}
          {step && (
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-hint)', fontWeight: 500 }}>
              {step} / {total}
            </span>
          )}
        </div>

        {/* 페이지 콘텐츠 영역 */}
        <div className="layout-body">{children}</div>
      </div>
    </>
  )
}
