/**
 * App.jsx — 앱 전체 라우팅 및 전역 상태 관리
 *
 * 사용자 흐름:
 *   / (브리징) → /schedule (일정 선택) → /questions (사전 질문) → /confirm (예약 완료)
 *                                      ↘ /reminder (나중에 알림)
 *   / → /chat (AI 채팅, 언제든 진입 가능)
 *
 * 상태:
 *   booking — SchedulePage에서 생성된 예약 정보 { date, time, counselor }
 *             QuestionsPage → ConfirmPage로 props drilling으로 전달됨
 *             실제 서비스에서는 Context 또는 서버 상태로 교체 필요
 */

import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import BridgingPage from './pages/BridgingPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import QuestionsPage from './pages/QuestionsPage.jsx'
import ConfirmPage from './pages/ConfirmPage.jsx'
import ReminderPage from './pages/ReminderPage.jsx'
import ChatPage from './pages/ChatPage.jsx'

export default function App() {
  // 예약 정보를 앱 최상위에서 관리 — SchedulePage가 설정하고, QuestionsPage·ConfirmPage가 읽음
  const [booking, setBooking] = useState(null)

  return (
    <Routes>
      {/* 검사 완료 직후 브리징 메시지 — 진입점 */}
      <Route path="/" element={<BridgingPage />} />

      {/* 상담 일정 선택 (달력 → 시간 슬롯 → 상담사) — 완료 시 booking 상태 저장 */}
      <Route path="/schedule" element={<SchedulePage onBook={setBooking} />} />

      {/* 사전 질문 수집 — booking을 props로 받아 미니 카드로 표시 */}
      <Route path="/questions" element={<QuestionsPage booking={booking} />} />

      {/* 예약 완료 + .ics 캘린더 다운로드 — booking 없으면 홈으로 리다이렉트 */}
      <Route path="/confirm" element={<ConfirmPage booking={booking} />} />

      {/* 나중에 예약하겠다고 선택한 경우 — 리마인더 시간 선택 + CS 연결 */}
      <Route path="/reminder" element={<ReminderPage />} />

      {/* AI 채팅 — Ollama 로컬 LLM과 실시간 스트리밍 대화 */}
      <Route path="/chat" element={<ChatPage />} />

      {/* 정의되지 않은 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
