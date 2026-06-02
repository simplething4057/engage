import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'exaone3.5:2.4b'

const SYSTEM_PROMPT = `당신은 아맘때 서비스의 보호자 안내 도우미입니다.

## 응답 규칙 (반드시 준수)
- 응답은 2~3문장을 넘지 않습니다. 짧고 명확하게 핵심만 답합니다.
- 불필요한 부연, 나열, 반복을 하지 않습니다.
- 보호자가 감정적인 질문을 하거나 불안해 보일 때만 한 문장의 공감을 먼저 씁니다. 그 외에는 바로 답합니다.
- 이모지, 번호 목록, 단락 나누기를 사용하지 않습니다.

## 할 수 있는 것
- CBCL 용어(T점수, 내재화, 외현화 등)가 무엇을 측정하는지 평어로 설명합니다.
- 상담 절차와 상담에서 얻을 수 있는 것을 안내합니다.
- 보호자의 걱정에 공감합니다.

## 절대 하지 말아야 할 것
- 검사 수치에 대한 임상적 해석, 진단, 판단을 내리지 않습니다.
- 결과 해석 요청에는 반드시 "정확한 해석은 상담사와 함께 확인하시는 게 좋아요."로만 답합니다. 추가 설명을 덧붙이지 않습니다.`

const QUICK_QUESTIONS = [
  'T점수가 뭔가요?',
  '내재화, 외현화가 무슨 뜻인가요?',
  '상담까지 왜 며칠이 걸리나요?',
  '결과가 나쁜 건 아닐까요?',
  '상담에서 어떤 걸 알 수 있나요?',
]

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
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--primary)' : '#fff',
        color: isUser ? '#fff' : 'var(--text-main)',
        fontSize: 14,
        lineHeight: 1.7,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: isUser ? 'none' : '1px solid var(--border)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </div>
  )
}

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
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요 보호자님 👋\n검사 결과가 궁금하거나 걱정되시는 부분이 있으시면 편하게 물어보세요. 임상적 해석은 상담사와 함께 살펴보시는 게 가장 좋지만, 궁금한 용어나 상담 절차에 대해서는 제가 도움을 드릴 수 있어요.',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setError(null)
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    const history = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
          stream: true,
        }),
      })

      if (!res.ok) throw new Error(`Ollama 연결 오류 (${res.status})`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)
        for (const line of lines) {
          try {
            const json = JSON.parse(line)
            const delta = json.message?.content || ''
            assistantText += delta
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantText }
              return updated
            })
          } catch {}
        }
      }
    } catch (e) {
      setError('Ollama에 연결할 수 없어요. Ollama가 실행 중인지 확인해 주세요.')
      setMessages(prev => prev.filter((_, i) => i < prev.length))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Layout showBack onBack={() => navigate(-1)}>
      {/* 안내 배너 */}
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
        {loading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
        {error && (
          <div style={{
            background: '#FFF0F0', border: '1px solid #FFB3B3',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, color: '#CC3333', marginBottom: 8,
          }}>{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 빠른 질문 */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 8, fontWeight: 500 }}>
            자주 묻는 질문
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
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

      {/* 입력창 */}
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

      {/* 일정 예약 유도 */}
      <div style={{ marginTop: 20 }}>
        <Btn onClick={() => navigate('/schedule')} variant="outline">
          📅 상담 일정 예약하기
        </Btn>
      </div>
    </Layout>
  )
}
