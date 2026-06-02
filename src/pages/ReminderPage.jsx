import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

const OPTIONS = [
  { value: 3, label: '3시간 후', desc: '잠깐 쉬고 다시 볼게요' },
  { value: 6, label: '6시간 후', desc: '오늘 저녁에 다시 알려주세요' },
  { value: 12, label: '12시간 후', desc: '내일 아침에 다시 알려주세요' },
  { value: 24, label: '24시간 후', desc: '내일 이맘때 다시 알려주세요' },
]

export default function ReminderPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🔔</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            {selected}시간 후에 알려드릴게요
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7, marginBottom: 36 }}>
            언제든 편하실 때 상담 일정을 선택해 주세요.<br />
            궁금한 점은 언제든 문의 주셔도 됩니다.
          </p>
          <Btn onClick={() => navigate('/')} style={{ marginBottom: 12 }}>
            홈으로 돌아가기
          </Btn>
          <Btn variant="outline" onClick={() => navigate('/schedule')}>
            지금 바로 예약하기
          </Btn>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack onBack={() => navigate(-1)}>
      <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 12 }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>⏰</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>나중에 알려드릴게요</h2>
        <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7 }}>
          지금 바로 결정하기 어려우시면<br />
          몇 시간 후에 다시 안내해 드릴게요.
        </p>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>
        언제 알림을 받으시겠어요?
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', borderRadius: 12,
              border: selected === opt.value ? '2px solid var(--primary)' : '1.5px solid var(--border)',
              background: selected === opt.value ? 'var(--primary-light)' : '#fff',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.12s',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>
                {opt.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>{opt.desc}</div>
            </div>
            {selected === opt.value && (
              <span style={{ color: 'var(--primary)', fontSize: 20 }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <Btn onClick={handleConfirm} disabled={!selected} style={{ marginBottom: 12 }}>
        알림 설정하기
      </Btn>

      {/* CS 연결 */}
      <div style={{
        background: 'var(--bg)', borderRadius: 12,
        padding: '16px', border: '1.5px solid var(--border)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
          💬 궁금한 점이 있으신가요?
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 12 }}>
          상담에 대해 궁금한 점이 있다면<br />
          상담사에게 직접 문의하실 수 있어요.
        </p>
        <button
          onClick={() => window.open('https://pf.kakao.com/_xmxdmxjA', '_blank')}
          style={{
            width: '100%', padding: '10px', borderRadius: 10,
            background: '#FEE500', color: '#3C1E1E',
            fontSize: 13, fontWeight: 700, border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <span>💬</span> 카카오톡으로 문의하기
        </button>
      </div>
    </Layout>
  )
}
