/**
 * QuestionsPage.jsx — 사전 질문 수집 (Step 2 / 3)
 *
 * 목적:
 *   상담 전 보호자의 관심사를 파악해 상담사가 미리 준비할 수 있도록 전달.
 *   선택을 강제하지 않아 보호자의 부담을 최소화.
 *
 * 입력 방식:
 *   1. 체크박스 선택지 5개 — 자주 묻는 질문 유형 (toggle 방식 다중 선택)
 *   2. 자유 입력 텍스트 — 200자 제한 (상담사에게 미리 알리고 싶은 내용)
 *
 * 데이터 흐름:
 *   선택된 질문 ID 배열(selected) + 자유 입력(freeText)
 *   → navigate('/confirm', { state: { questions, freeText } })
 *   → ConfirmPage에서 useLocation().state로 읽음
 *   (App 레벨 상태가 아닌 React Router state로 전달 — 일회성 데이터에 적합)
 *
 * Props:
 *   booking — App에서 내려받은 예약 정보. 상단 미니 카드로 예약 내용 확인 가능.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

// 사전 질문 선택지 — id는 ConfirmPage의 QUESTION_LABELS와 1:1 매핑됨
const QUESTIONS = [
  { id: 'q1', text: '검사 수치가 높게/낮게 나온 이유가 궁금해요' },
  { id: 'q2', text: '일상에서 어떻게 도와야 할지 모르겠어요' },
  { id: 'q3', text: '또래와 비교했을 때 어느 정도인지 알고 싶어요' },
  { id: 'q4', text: '추가 전문 기관 연계가 필요한지 궁금해요' },
  { id: 'q5', text: '학교/어린이집에 어떻게 이야기해야 할지 모르겠어요' },
]

export default function QuestionsPage({ booking }) {
  const navigate = useNavigate()

  // selected — 현재 체크된 질문 ID 배열 (다중 선택)
  const [selected, setSelected] = useState([])
  const [freeText, setFreeText] = useState('')

  // 토글 함수 — 이미 선택된 경우 제거, 아닌 경우 추가
  function toggle(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // 다음 단계로 이동 — React Router state에 선택 데이터 포함
  function handleNext() {
    navigate('/confirm', { state: { questions: selected, freeText } })
  }

  return (
    <Layout showBack onBack={() => navigate(-1)} step={2} total={3}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>상담에서 알고 싶은 것</h2>
      <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 6 }}>
        상담사가 미리 준비할 수 있도록 알려주세요.
      </p>
      {/* 선택 강제하지 않음 안내 — 이탈 방지 */}
      <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 24, background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
        선택 안 하셔도 상담은 정상 진행됩니다 ✓
      </p>

      {/* 예약 정보 미니 카드 — booking이 있을 때만 표시 */}
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

      {/* 체크박스 선택지 목록 */}
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
              {/* 커스텀 체크박스 — 선택 시 보라색 배경 + 체크 표시 */}
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

      {/* 자유 입력 텍스트 영역 — 200자 제한, 실시간 글자 수 표시 */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
          상담사에게 꼭 전하고 싶은 말 <span style={{ color: 'var(--text-hint)', fontWeight: 400 }}>(선택)</span>
        </label>
        <textarea
          value={freeText}
          onChange={e => setFreeText(e.target.value.slice(0, 200))} // 200자 초과 입력 방지
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
        {/* 실시간 글자 수 카운터 */}
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-hint)', marginTop: 4 }}>
          {freeText.length} / 200
        </div>
      </div>

      {/* 아무것도 선택 안 해도 다음으로 진행 가능 */}
      <Btn onClick={handleNext}>다음</Btn>
    </Layout>
  )
}
