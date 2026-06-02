import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import BridgingPage from './pages/BridgingPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import QuestionsPage from './pages/QuestionsPage.jsx'
import ConfirmPage from './pages/ConfirmPage.jsx'
import ReminderPage from './pages/ReminderPage.jsx'
import ChatPage from './pages/ChatPage.jsx'

export default function App() {
  const [booking, setBooking] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<BridgingPage />} />
      <Route path="/schedule" element={<SchedulePage onBook={setBooking} />} />
      <Route path="/questions" element={<QuestionsPage booking={booking} />} />
      <Route path="/confirm" element={<ConfirmPage booking={booking} />} />
      <Route path="/reminder" element={<ReminderPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
