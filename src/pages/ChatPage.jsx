/**
 * ChatPage.jsx — AI 채팅 (Ollama 로컬 LLM 연동)
 *
 * 핵심 동작:
 *   1. 사용자 메시지 전송 → Ollama API에 POST 요청 (스트리밍 모드)
 *   2. ReadableStream으로 응답을 청크 단위로 읽어 실시간으로 화면에 표시
 *   3. 마지막 메시지(assistant)를 청크가 올 때마다 업데이트 → 타이핑 효과
 *
 * AI 설계 원칙 (시스템 프롬프트로 강제):
 *   - 응답 2~3문장 제한 — 핵심만, 부연 없음
 *   - CBCL 용어 설명·공감만 허용
 *   - 임상 해석·진단 절대 금지
 *   - 결과 해석 요청 → 고정 문구 "정확한 해석은 상담사와 함께 확인하시는 게 좋아요."만 응답
 *
 * 데이터 흐름:
 *   messages 배열 → Ollama에 전체 대화 히스토리 포함 전송
 *   → 스트리밍 응답 → 마지막 항목(assistant)에 청크 누적
 *   → React 상태 업데이트로 실시간 렌더링
 *
 * 개인정보:
 *   로컬에서만 추론 — 보호자 입력이 외부 서버로 전송되지 않음
 */

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

// Ollama 로컬 서버 주소 및 모델명
// CORS 허용 설정 필요: OLLAMA_ORIGINS=* 환경변수 후 재시작
const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'exaone3.5:2.4b' // LG AI Research 한국어 특화 경량 모델

// 시스템 프롬프트 — AI 응답 범위와 형식을 엄격하게 제한
// 이 프롬프트가 임상 해석 금지 원칙의 핵심 구현체
// 사측 제공 샘플 보고서(K-CBCL)를 기반으로 실제 등장 용어를 추가 반영
const SYSTEM_PROMPT = `당신은 아맘때 서비스의 보호자 안내 도우미입니다.

## 응답 규칙 (반드시 준수)
- 응답은 2~3문장을 넘지 않습니다. 짧고 명확하게 핵심만 답합니다.
- 불필요한 부연, 나열, 반복을 하지 않습니다.
- 보호자가 감정적인 질문을 하거나 불안해 보일 때만 한 문장의 공감을 먼저 씁니다. 그 외에는 바로 답합니다.
- 이모지, 번호 목록, 단락 나누기를 사용하지 않습니다.

## 설명할 수 있는 K-CBCL 용어 목록
아래 용어가 무엇을 측정하는지 평어로 설명할 수 있습니다.
- T점수: 또래 평균을 50으로, 표준편차를 10으로 환산한 점수. 비교 기준일 뿐 절대적 수치가 아님.
- 백분위(%tile): 같은 연령·성별 또래 100명 중 몇 등에 해당하는지 나타냄.
- 정상 범위 / 준임상 범위 / 임상 범위: 종합척도 기준 60T 미만 정상, 60~62T 준임상(관찰 권장), 63T 이상 임상. 개별 증후군 척도는 70T 이상이 임상 기준.
- 내재화 문제(Internalizing): 감정을 안으로 억누르는 경향. 위축·신체증상·우울/불안 척도를 포함.
- 외현화 문제(Externalizing): 감정을 행동으로 표출하는 경향. 비행·공격성 척도를 포함.
- 총 문제행동(Total Problems): 117문항 전체를 종합한 점수.
- 위축(Withdrawn): 혼자 있기 선호, 소극적 태도 등 사회적 위축 경향.
- 신체증상(Somatic Complaints): 뚜렷한 이유 없는 두통·복통 등 신체 불편 호소.
- 우울/불안(Depressed/Anxious): 걱정·긴장·불안·슬픔 관련 정서 반응.
- 사회적 미성숙(Social Immaturity): 연령에 비해 의존적이거나 미성숙한 행동 양상.
- 사고의 문제(Thought Problems): 반복적이거나 기이한 사고·행동 경향.
- 주의집중 문제(Attention Problems): 산만함, 집중 어려움, 충동적 행동 등.
- 비행(Delinquent): 규칙 위반, 거짓말, 도둑질 등 규범 이탈 행동.
- 공격성(Aggressive): 언어적·신체적 공격 행동.
- 종합척도 vs 개별 증후군 척도: 종합척도(내재화·외현화·총 문제행동)는 63T, 개별 척도(위축 등 8개)는 70T가 임상 기준. 기준이 다름.

## 할 수 있는 것
- 위 용어들이 무엇을 측정하는지 평어로 설명합니다.
- 상담 절차와 상담에서 얻을 수 있는 것을 안내합니다.
- 보호자의 걱정과 불안에 공감합니다.
- 집과 학교에서 행동이 다른 이유, 재평가 권장 이유 등 일반적인 배경 설명을 합니다.

## 절대 하지 말아야 할 것
- 특정 수치에 대해 "높다/낮다/괜찮다/위험하다"는 임상적 판단을 내리지 않습니다.
- ADHD, 우울증, 불안장애 등 진단명을 언급하지 않습니다.
- 결과 해석·치료 필요 여부를 묻는 질문에는 반드시 "정확한 해석은 상담사와 함께 확인하시는 게 좋아요."로만 답합니다. 추가 설명을 덧붙이지 않습니다.`

// 초기 화면에서 제공하는 빠른 질문 목록
// 사측 제공 샘플 K-CBCL 보고서에 실제 등장하는 용어·상황을 기반으로 선정
// 보호자가 보고서를 받은 직후 가장 많이 혼란스러워하는 지점을 우선 배치
const QUICK_QUESTIONS = [
  '준임상 범위가 뭔가요? 나쁜 건가요?',
  '내재화·외현화가 무슨 뜻인가요?',
  '주의집중 문제가 높으면 ADHD인가요?',
  '종합척도 63T랑 개별척도 70T 기준이 왜 달라요?',
  '집에선 괜찮은데 학교에서만 문제가 있다고 해요',
]

// 개별 메시지 버블 컴포넌트
// role이 'user'면 오른쪽 정렬·보라색, 'assistant'면 왼쪽 정렬·흰색
function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
      alignItems: 'flex-end',
      gap: 8,
    }}>
      {/* AI 아바타 — assistant 메시지 왼쪽에만 표시 */}
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '12px 16px',
        // 말풍선 모양: user는 오른쪽 아래 뾰족, assistant는 왼쪽 아래 뾰족
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--primary)' : '#fff',
        color: isUser ? '#fff' : 'var(--text-main)',
        fontSize: 14,
        lineHeight: 1.7,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: isUser ? 'none' : '1px solid var(--border)',
        whiteSpace: 'pre-wrap', // 줄바꿈 그대로 유지
      }}>
        {msg.content}
      </div>
    </div>
  )
}

// AI가 응답 생성 중일 때 표시하는 세 점 애니메이션
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--primary-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>🤖</div>
      <div style={{
        padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
        background: '#fff', border: '1px solid var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {/* 세 점이 순차적으로 튀어오르는 bounce 애니메이션 */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--text-hint)',
            animation: `bounce 1.2s ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function ChatPage() {
  const navigate = useNavigate()

  // messages — 전체 대화 히스토리. Ollama API에 매 요청마다 전체를 포함해 전송 (컨텍스트 유지)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요 보호자님 👋\n검사 결과가 궁금하거나 걱정되시는 부분이 있으시면 편하게 물어보세요. 임상적 해석은 상담사와 함께 살펴보시는 게 가장 좋지만, 궁금한 용어나 상담 절차에 대해서는 제가 도움을 드릴 수 있어요.',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false) // 스트리밍 진행 중 여부
  const [error, setError] = useState(null)      // Ollama 연결 오류 메시지
  const bottomRef = useRef(null)                // 새 메시지 도착 시 자동 스크롤 대상
  const inputRef = useRef(null)                 // 전송 후 입력창 포커스 복원용

  // 새 메시지 추가될 때마다 하단으로 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // 메시지 전송 및 Ollama 스트리밍 응답 처리
  async function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setError(null)

    // 사용자 메시지를 히스토리에 추가
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    // Ollama API 요청 형식: system 프롬프트 + 전체 대화 히스토리
    const history = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
          stream: true, // 스트리밍 모드 — 청크 단위로 응답 수신
        }),
      })

      if (!res.ok) throw new Error(`Ollama 연결 오류 (${res.status})`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      // 빈 assistant 메시지를 먼저 추가 — 이후 청크가 올 때마다 마지막 항목을 업데이트
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      // 스트리밍 루프 — done이 true가 될 때까지 청크를 계속 읽음
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        // 한 청크에 여러 JSON 줄이 포함될 수 있으므로 줄 단위로 분리 후 파싱
        const lines = chunk.split('\n').filter(Boolean)
        for (const line of lines) {
          try {
            const json = JSON.parse(line)
            const delta = json.message?.content || ''
            assistantText += delta
            // 마지막 메시지(assistant)의 content를 누적 텍스트로 교체 → 타이핑 효과
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantText }
              return updated
            })
          } catch {} // JSON 파싱 실패 시 해당 줄 무시 (불완전한 청크 발생 가능)
        }
      }
    } catch (e) {
      // Ollama 미실행 또는 CORS 오류 시 사용자에게 안내
      setError('Ollama에 연결할 수 없어요. Ollama가 실행 중인지 확인해 주세요.')
      setMessages(prev => prev.filter((_, i) => i < prev.length))
    } finally {
      setLoading(false)
      inputRef.current?.focus() // 전송 완료 후 입력창으로 포커스 복원
    }
  }

  // Enter 키로 전송 (Shift+Enter는 줄바꿈)
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Layout showBack onBack={() => navigate(-1)}>
      {/* AI 역할 한계 안내 배너 — 임상 해석이 아님을 항상 상단에 고지 */}
      <div style={{
        background: 'var(--accent-light)', borderRadius: 10,
        padding: '10px 14px', marginBottom: 16,
        fontSize: 12, color: '#AA5533', lineHeight: 1.6,
      }}>
        💡 이 대화는 용어 안내와 공감을 위한 것이에요. 결과의 임상적 해석은 상담사와 함께 진행됩니다.
      </div>

      {/* 메시지 목록 */}
      <div style={{ marginBottom: 16 }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {/* 사용자 메시지 직후 AI 응답 스트림이 시작되기 전에만 타이핑 인디케이터 표시 */}
        {loading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
        {error && (
          <div style={{
            background: '#FFF0F0', border: '1px solid #FFB3B3',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, color: '#CC3333', marginBottom: 8,
          }}>{error}</div>
        )}
        {/* 자동 스크롤 앵커 */}
        <div ref={bottomRef} />
      </div>

      {/* 빠른 질문 버튼 — 첫 메시지(초기 인사)만 있을 때만 표시 */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 8, fontWeight: 500 }}>
            자주 묻는 질문
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)} // 클릭 시 바로 해당 질문을 전송
                style={{
                  padding: '7px 12px', borderRadius: 20,
                  border: '1.5px solid var(--border)',
                  background: '#fff', fontSize: 12,
                  color: 'var(--text-sub)', cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.1s',
                }}
              >{q}</button>
            ))}
          </div>
        </div>
      )}

      {/* 텍스트 입력창 + 전송 버튼 */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-end',
        background: '#fff', borderRadius: 14,
        border: '1.5px solid var(--border)',
        padding: '8px 8px 8px 14px',
        boxShadow: 'var(--shadow)',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="궁금한 점을 입력하세요..."
          rows={1}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 14, lineHeight: 1.6, resize: 'none',
            background: 'transparent', color: 'var(--text-main)',
            maxHeight: 100, overflowY: 'auto',
            fontFamily: 'inherit',
          }}
        />
        {/* 전송 버튼 — 입력 없거나 로딩 중이면 비활성 */}
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: !input.trim() || loading ? 'var(--border)' : 'var(--primary)',
            border: 'none', cursor: !input.trim() || loading ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, transition: 'all 0.15s',
          }}
        >↑</button>
      </div>

      {/* 채팅 하단 예약 유도 버튼 — AI 채팅 후 자연스럽게 예약으로 연결 */}
      <div style={{ marginTop: 20 }}>
        <Btn onClick={() => navigate('/schedule')} variant="outline">
          📅 상담 일정 예약하기
        </Btn>
      </div>
    </Layout>
  )
}
