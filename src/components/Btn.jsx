/**
 * Btn.jsx — 공통 버튼 컴포넌트
 *
 * Props:
 *   variant  — 'primary' | 'outline' | 'ghost' (기본값: 'primary')
 *   disabled — true일 때 회색으로 표시되고 클릭 불가
 *   style    — 추가 인라인 스타일 (marginTop 등 위치 조정용)
 *
 * 세 가지 variant:
 *   primary — 채워진 보라색 버튼. 주요 CTA (예: "상담 일정 선택하기")
 *   outline — 테두리만 있는 버튼. 보조 액션 (예: "AI 채팅으로 이동")
 *   ghost   — 배경·테두리 없음. 낮은 우선순위 액션 (예: "나중에 선택할게요")
 */

import React from 'react'

export default function Btn({ children, onClick, variant = 'primary', disabled, style }) {
  // 모든 variant에 공통 적용되는 기본 스타일
  const base = {
    display: 'block',
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    transition: 'all 0.15s',
    letterSpacing: '-0.2px',
  }

  // variant별 스타일 — disabled 상태는 primary에서만 시각적으로 처리
  const variants = {
    primary: {
      background: disabled ? 'var(--border)' : 'var(--primary)',
      color: disabled ? 'var(--text-hint)' : '#fff',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(123,97,255,0.3)',
    },
    outline: {
      background: '#fff',
      color: 'var(--primary)',
      border: '1.5px solid var(--primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-sub)',
      fontSize: 14,
    },
  }

  // base → variant → 외부 style 순으로 병합 (뒤에 올수록 우선)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}
