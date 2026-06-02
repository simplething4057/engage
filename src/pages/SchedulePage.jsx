import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

const YEAR = 2026
const MONTH = 6 // 1-indexed

function getDaysInMonth(y, m) {
  return new Date(y, m, 0).getDate()
}
function getFirstDay(y, m) {
  return new Date(y, m - 1, 1).getDay()
}

const DISABLED_DAYS = [1, 7, 8, 14, 15, 21, 22, 28, 29] // weekends simplified
const SLOTS = ['10:00', '11:00', '14:00', '15:00', '16:00']
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const COUNSELORS = [
  { id: 1, name: '김지연 상담사', tags: ['아동·청소년', 'CBCL 전문'] },
  { id: 2, name: '이수진 상담사', tags: ['발달심리', '부모상담'] },
  { id: 3, name: '박현우 상담사', tags: ['놀이치료', '학습지원'] },
]

export default function SchedulePage({ onBook }) {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedCounselor, setSelectedCounselor] = useState(null)

  const days = getDaysInMonth(YEAR, MONTH)
  const firstDay = getFirstDay(YEAR, MONTH)
  const today = new Date().getDate()

  function handleConfirm() {
    const booking = {
      date: `2026년 6월 ${selectedDay}일`,
      time: selectedSlot,
      counselor: COUNSELORS.find(c => c.id === selectedCounselor)?.name,
    }
    onBook(booking)
    navigate('/questions')
  }

  const canConfirm = selectedDay && selectedSlot && selectedCounselor

  return (
    <Layout showBack onBack={() => navigate(-1)} step={1} total={3}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>상담 일정 선택</h2>
      <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 24 }}>
        편한 날짜와 시간을 직접 선택해 주세요
      </p>

      {/* 달력 */}
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '16px', marginBottom: 20,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--text-main)' }}>
          2026년 6월
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
          {DAY_NAMES.map((d, i) => (
            <div key={d} style={{
              textAlign: 'center', fontSize: 11, fontWeight: 600,
              color: i === 0 ? '#FF4E4E' : i === 6 ? '#4E91FF' : 'var(--text-sub)',
              padding: '4px 0',
            }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const d = i + 1
            const isDisabled = DISABLED_DAYS.includes(d) || d < today
            const isSelected = selectedDay === d
            return (
              <button
                key={d}
                disabled={isDisabled}
                onClick={() => { setSelectedDay(d); setSelectedSlot(null) }}
                style={{
                  borderRadius: 10,
                  padding: '8px 0',
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 400,
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#fff' : isDisabled ? 'var(--border)' : 'var(--text-main)',
                  border: 'none',
                  cursor: isDisabled ? 'default' : 'pointer',
                  transition: 'all 0.1s',
                }}
              >{d}</button>
            )
          })}
        </div>
      </div>

      {/* 시간 슬롯 */}
      {selectedDay && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 10 }}>
            6월 {selectedDay}일 가능한 시간
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  border: selectedSlot === slot ? 'none' : '1.5px solid var(--border)',
                  background: selectedSlot === slot ? 'var(--primary)' : '#fff',
                  color: selectedSlot === slot ? '#fff' : 'var(--text-main)',
                  boxShadow: selectedSlot === slot ? '0 2px 8px rgba(123,97,255,0.25)' : 'none',
                  transition: 'all 0.12s',
                }}
              >{slot}</button>
            ))}
          </div>
        </div>
      )}

      {/* 상담사 선택 */}
      {selectedSlot && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 10 }}>
            상담사 선택
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COUNSELORS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCounselor(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: selectedCounselor === c.id ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: selectedCounselor === c.id ? 'var(--primary-light)' : '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: selectedCounselor === c.id ? 'var(--primary)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>👩‍⚕️</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {c.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 11, background: 'var(--bg)',
                        color: 'var(--text-sub)', padding: '2px 8px',
                        borderRadius: 20, border: '1px solid var(--border)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                {selectedCounselor === c.id && (
                  <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 18 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Btn onClick={handleConfirm} disabled={!canConfirm}>
        이 일정으로 예약할게요
      </Btn>
    </Layout>
  )
}
