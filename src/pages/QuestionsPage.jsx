import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

const QUESTIONS = [
  { id: 'q1', text: '검사 수치가 높게/낮게 나온 이유가 궁금해요' },
  { id: 'q2', text: '일상에서 어떻게 도와야 할지 모르겠어요' },
  { id: 'q3', text: '또래와 비교했을 때 어느 정도인지 알고 싶어요' },
  { id: 'q4', text: '추가 전문 기관 연계가 필요한지 궁금해요' },
  { id: 'q5', text: '학교/어린이집에 어떻게 이야기해야 할지 모르겠어요' },
]

export default function QuestionsPage({ booking }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [freeText, setFreeText] = useState('')

  function toggle(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleNext() {
    navigate('/confirm', { state: { questions: selected, freeText } })
  }

  return (
    <Layout showBack onBack={() => navigate(-1)} step={2} total={3}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>상담에서 알고 싶은 것</h2>
      <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 6 }}>
        상담사가 미리 준비할 수 있도록 알려주세요.
      </p>
      <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 24, background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
        선택 안 하셔도 상담은 정상 진행됩니다 ✓
      </p>

      {/* 예약 정보 미니 카드 */}
      {booking && (
        <div style={{
          background: 'var(--primary-light)', borderRadius: 12,
          padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>📅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
              {booking.date} {booking.time}
            </div>
            <div style={{ fontSize: 12, color: '#7B61FF99' }}>{booking.counselor}</div>
          </div>
        </div>
      )}

      {/* 선택지 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {QUESTIONS.map(q => {
          const isSelected = selected.includes(q.id)
          return (
            <button
              key={q.id}
              onClick={() => toggle(q.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                background: isSelected ? 'var(--primary-light)' : '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                border: isSelected ? 'none' : '1.5px solid var(--border)',
                background: isSelected ? 'var(--primary)' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: '#fff', fontWeight: 700,
              }}>
                {isSelected ? '✓' : ''}
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5, fontWeight: isSelected ? 600 : 400 }}>
                {q.text}
              </span>
            </button>
          )
        })}
      </div>

      {/* 자유 입력 */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
          상담사에게 꼭 전하고 싶은 말 <span style={{ color: 'var(--text-hint)', fontWeight: 400 }}>(선택)</span>
        </label>
        <textarea
          value={freeText}
          onChange={e => setFreeText(e.target.value.slice(0, 200))}
          placeholder="아이에 대해 상담사가 미리 알면 좋을 내용이 있다면 적어주세요"
          style={{
            width: '100%',
            minHeight: 100,
            padding: '12px 14px',
            borderRadius: 12,
            border: '1.5px solid var(--border)',
            fontSize: 14,
            color: 'var(--text-main)',
            lineHeight: 1.7,
            resize: 'none',
            outline: 'none',
            background: '#fff',
          }}
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-hint)', marginTop: 4 }}>
          {freeText.length} / 200
        </div>
      </div>

      <Btn onClick={handleNext}>다음</Btn>
    </Layout>
  )
}
