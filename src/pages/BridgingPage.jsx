import React from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Btn from '../components/Btn.jsx'

const benefits = [
  { icon: '🔍', title: '결과의 의미 이해', desc: '수치와 그래프가 우리 아이에게 어떤 의미인지 설명해 드려요' },
  { icon: '🌱', title: '실천 가능한 방향 제안', desc: '일상에서 바로 적용할 수 있는 구체적인 방법을 안내해 드려요' },
  { icon: '🏥', title: '전문 기관 연계 판단', desc: '필요한 경우 가장 적합한 전문 기관을 안내해 드려요' },
]

export default function BridgingPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      {/* 완료 배지 */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, margin: '0 auto 16px',
        }}>✅</div>
        <div style={{
          display: 'inline-block',
          background: 'var(--success-light)',
          color: 'var(--success)',
          fontSize: 12, fontWeight: 600,
          padding: '4px 12px', borderRadius: 20, marginBottom: 12,
        }}>검사 완료</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, color: 'var(--text-main)', marginBottom: 8 }}>
          수고하셨어요, 보호자님 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7 }}>
          검사가 모두 완료되었어요.<br />
          결과를 함께 살펴볼 해석 상담을 예약해 드릴게요.
        </p>
      </div>

      {/* 안내 카드 */}
      <div style={{
        background: 'var(--primary-light)',
        borderRadius: 'var(--radius)',
        padding: '18px 20px',
        marginBottom: 24,
        borderLeft: '4px solid var(--primary)',
      }}>
        <p style={{ fontSize: 14, color: '#4A3A8A', lineHeight: 1.8 }}>
          검사 결과에는 아이의 여러 면이 담겨 있어요.
          숫자나 용어만으로는 우리 아이에게 어떤 의미인지 알기 어렵습니다.
          <strong> 상담에서는 결과를 아이의 일상과 연결해 설명</strong>드리고,
          앞으로 어떻게 도울 수 있는지 함께 이야기 나눌 수 있어요.
        </p>
        <p style={{ fontSize: 11, color: '#9B8FCC', marginTop: 10, lineHeight: 1.5 }}>
          * 이 안내는 검사 결과를 해석한 내용이 아닙니다.<br />
          * 검사 결과와 관계없이 모든 보호자께 드리는 안내입니다.
        </p>
      </div>

      {/* 상담에서 얻을 수 있는 것 */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>
        상담에서 얻을 수 있는 것
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {benefits.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 16px',
            boxShadow: 'var(--shadow)',
          }}>
            <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{b.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 3 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 상담 정보 태그 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {['소요 시간 약 30분', '결과지 없이도 참여 가능', '전화 상담'].map((tag, i) => (
          <span key={i} style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '6px 12px',
            fontSize: 12,
            color: 'var(--text-sub)',
            fontWeight: 500,
          }}>✓ {tag}</span>
        ))}
      </div>

      <Btn onClick={() => navigate('/schedule')}>
        상담 일정 선택하기
      </Btn>
      <Btn variant="outline" onClick={() => navigate('/chat')} style={{ marginTop: 12 }}>
        💬 결과에 대해 먼저 물어보고 싶어요
      </Btn>
      <Btn variant="ghost" onClick={() => navigate('/reminder')} style={{ marginTop: 8 }}>
        나중에 선택할게요
      </Btn>
    </Layout>
  )
}
