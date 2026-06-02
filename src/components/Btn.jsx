import React from 'react'

export default function Btn({ children, onClick, variant = 'primary', disabled, style }) {
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
