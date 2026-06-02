import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

const QUESTION_LABELS = {
  q1: '검사 수치 이유',
  q2: '일상 지원 방법',
  q3: '또래 비교',
  q4: '전문 기관 연계',
  q5: '학교/어린이집 안내',
}

function generateICS(booking) {
  const dateStr = `20260601T${booking.time.replace(':', '')}00`
  const endTime = booking.time === '10:00' ? '103000' :
    booking.time === '11:00' ? '113000' :
    booking.time === '14:00' ? '143000' :
    booking.time === '15:00' ? '153000' : '163000'
  const endStr = `20260601T${endTime}`

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//아맘때//Amamttae//KO
BEGIN:VEVENT
UID:amamttae-${Date.now()}@insighter.co.kr
DTSTAMP:20260601T000000Z
DTSTART:${dateStr}
DTEND:${endStr}
SUMMARY:아맘때 해석 상담 - ${booking.counselor}
DESCRIPTION:아맘때 CBCL 검사 해석 상담입니다.\\n상담사: ${booking.counselor}\\n소요시간: 약 30분
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:1시간 후 아맘때 해석 상담이 있어요
END:VALARM
END:VEVENT
END:VCALENDAR`
}

export default function ConfirmPage({ booking }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { questions = [], freeText = '' } = location.state || {}
  const [calAdded, setCalAdded] = useState(false)

  if (!booking) {
    navigate('/')
    return null
  }

  function handleAddCalendar() {
    const ics = generateICS(booking)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '아맘때_해석상담.ics'
    a.click()
    URL.revokeObjectURL(url)
    setCalAdded(true)
  }

  return (
    <Layout showBack onBack={() => navigate(-1)} step={3} total={3}>
      {/* 완료 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 16px',
        }}>🎉</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>예약이 완료되었어요!</h2>
        <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>
          상담 전날과 당일 1시간 전에 알림을 보내드릴게요
        </p>
      </div>

      {/* 예약 상세 */}
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hint)', marginBottom: 14, letterSpacing: '0.5px' }}>
          예약 정보
        </div>
        {[
          { label: '날짜', value: booking.date },
          { label: '시간', value: booking.time },
          { label: '상담사', value: booking.counselor },
          { label: '방식', value: '전화 상담' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* 사전 질문 요약 */}
      {(questions.length > 0 || freeText) && (
        <div style={{
          background: 'var(--primary-light)', borderRadius: 'var(--radius)',
          padding: '16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 10, letterSpacing: '0.5px' }}>
            전달된 사전 질문
          </div>
          {questions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: freeText ? 10 : 0 }}>
              {questions.map(qid => (
                <span key={qid} style={{
                  fontSize: 12, background: '#fff', color: 'var(--primary)',
                  padding: '4px 10px', borderRadius: 20,
                  border: '1px solid var(--primary)',
                  fontWeight: 500,
                }}>{QUESTION_LABELS[qid]}</span>
              ))}
            </div>
          )}
          {freeText && (
            <div style={{
              fontSize: 13, color: '#4A3A8A', lineHeight: 1.7,
              background: '#fff', borderRadius: 8, padding: '10px 12px',
              fontStyle: 'italic',
            }}>
              "{freeText}"
            </div>
          )}
        </div>
      )}

      {/* 캘린더 추가 */}
      <div style={{
        background: calAdded ? 'var(--success-light)' : 'var(--bg)',
        border: `1.5px solid ${calAdded ? 'var(--success)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', padding: '16px', marginBottom: 28,
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>
              {calAdded ? '✅ 캘린더에 추가됨' : '📅 캘린더에 추가하기'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>
              {calAdded ? '알림이 자동으로 설정되었어요' : 'Google, Apple 캘린더 모두 지원'}
            </div>
          </div>
          {!calAdded && (
            <button
              onClick={handleAddCalendar}
              style={{
                padding: '8px 16px', borderRadius: 10,
                background: 'var(--primary)', color: '#fff',
                fontSize: 13, fontWeight: 600, border: 'none',
                cursor: 'pointer',
              }}
            >추가</button>
          )}
        </div>
      </div>

      <Btn onClick={() => navigate('/')}>홈으로 돌아가기</Btn>
    </Layout>
  )
}
