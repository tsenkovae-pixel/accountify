'use client';

import Link from 'next/link';
import { Calculator, Sparkles, Trophy, Play, ChevronRight, CheckCircle, Shield, RefreshCw, CreditCard } from 'lucide-react';
import DailyQuote from '@/components/DailyQuote';
import { useState } from 'react';

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FC' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #3E2A9C 0%, #5B3FD6 100%)',
        color: 'white',
        padding: '20px 40px',
        boxShadow: '0 4px 20px rgba(62, 42, 156, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: '#F59E0B', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#3E2A9C',
              fontSize: '20px'
            }}>
              A
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Accountify</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '32px' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Начало</Link>
            <Link href="/simulator" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Симулатор</Link>
            <Link href="/smetkoplan" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Сметкоплан</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px' }}>
        {/* Hero с градиент */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '60px',
          background: 'linear-gradient(135deg, rgba(91, 63, 214, 0.1) 0%, rgba(124, 92, 255, 0.05) 100%)',
          padding: '60px 40px',
          borderRadius: '24px',
          border: '1px solid rgba(91, 63, 214, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#3E2A9C',
            margin: '0 0 20px 0',
            lineHeight: 1.2
          }}>
            Научи счетоводство<br />
            <span style={{ color: '#F59E0B' }}>чрез реални счетоводни операции</span>
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#1F2937',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6
          }}>
            Решавай реални счетоводни казуси и получавай обратна връзка от AI
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
            <Link href="/simulator">
              <button style={{
                background: '#F59E0B',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Play size={20} />
                Започни безплатно
              </button>
            </Link>
            
            <Link href="/smetkoplan">
              <button style={{
                background: 'white',
                color: '#5B3FD6',
                padding: '16px 32px',
                borderRadius: '12px',
                border: '2px solid #5B3FD6',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Виж сметкоплана
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#059669',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <CheckCircle size={16} />
            <span>Първите задачи са напълно безплатни</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginBottom: '60px'
        }}>
          <StatCard icon={<Calculator size={32} color="#F59E0B" />} title="20+ практически задачи" description="Реални операции от бизнеса" />
          <StatCard icon={<Sparkles size={32} color="#F59E0B" />} title="AI счетоводен асистент" description="Обратна връзка и обяснения" />
          <StatCard icon={<Trophy size={32} color="#F59E0B" />} title="Безплатен достъп" description="Започни без регистрация" />
        </div>

        {/* Features */}
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(62, 42, 156, 0.08)',
          border: '1px solid rgba(91, 63, 214, 0.1)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '60px'
        }}>
          <div>
            <h2 style={{ color: '#3E2A9C', fontSize: '32px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
              Защо Accountify?
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Интерактивни задачи с реални документи', 'AI асистент обяснява всяка грешка', '3 нива на трудност', 'Сертификат при завършване'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#1F2937', fontSize: '16px' }}>
                  <span style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '20px' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(91, 63, 214, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            borderRadius: '16px',
            padding: '32px',
            border: '2px dashed rgba(91, 63, 214, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <p style={{ color: '#3E2A9C', fontWeight: 'bold', margin: '0 0 8px 0' }}>Започни сега</p>
            <p style={{ color: '#1F2937', fontSize: '14px', margin: 0 }}>Първият модул е безплатен</p>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#3E2A9C', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              Избери своя план
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '32px' }}>
              Започни безплатно и ъпгрейдни когато си готов
            </p>
            
            {/* Toggle */}
            <div style={{ 
              display: 'inline-flex', 
              background: '#E5E7EB', 
              borderRadius: '50px', 
              padding: '4px'
            }}>
              <button 
                onClick={() => setIsYearly(false)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '50px',
                  border: 'none',
                  background: !isYearly ? '#5B3FD6' : 'transparent',
                  color: !isYearly ? 'white' : '#374151',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Месечно
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '50px',
                  border: 'none',
                  background: isYearly ? '#5B3FD6' : 'transparent',
                  color: isYearly ? 'white' : '#374151',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Годишно
                <span style={{ 
                  background: '#F59E0B', 
                  color: 'white', 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  borderRadius: '10px' 
                }}>
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px'
          }}>
            {/* FREE PLAN */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '32px',
              border: '2px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#3E2A9C', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Стажант</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
                0 лв.<span style={{ fontSize: '16px', color: '#6B7280', fontWeight: 'normal' }}>/винаги</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left' }}>
                {['Първите 8 задачи безплатно', 'Базов сметкоплан', 'AI обратна връзка', 'Достъп до форум'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#1F2937' }}>
                    <CheckCircle size={16} color="#059669" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/simulator" style={{ display: 'block', textDecoration: 'none' }}>
                <button style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '2px solid #5B3FD6', 
                  background: 'white', 
                  color: '#5B3FD6', 
                  fontWeight: 'bold', 
                  cursor: 'pointer' 
                }}>
                  Започни безплатно
                </button>
              </Link>
            </div>

            {/* PRO PLAN */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '32px',
              border: '3px solid #F59E0B',
              position: 'relative',
              transform: 'scale(1.05)',
              boxShadow: '0 10px 40px rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-12px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: '#F59E0B', 
                color: 'white', 
                padding: '4px 16px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: 'bold' 
              }}>
                НАЙ-ПОПУЛЯРЕН
              </div>
              <h3 style={{ color: '#3E2A9C', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Младши Счетоводител</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
                {isYearly ? '95.90' : '9.99'} лв.<span style={{ fontSize: '16px', color: '#6B7280', fontWeight: 'normal' }}>/{isYearly ? 'год' : 'мес'}</span>
              </div>
              {isYearly && <p style={{ color: '#F59E0B', fontSize: '14px', marginBottom: '16px' }}>Спестяваш 24 лв.</p>}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left' }}>
                {['Всички 15+ задачи', 'Седмица 1 и 2 (ДДС)', 'Подробни обяснения', 'Сравнение МСС/НСС', 'Имейл подкрепа'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#1F2937' }}>
                    <CheckCircle size={16} color="#F59E0B" /> {item}
                  </li>
                ))}
              </ul>
              <button style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: 'none', 
                background: '#F59E0B', 
                color: 'white', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                Започни пробен период
              </button>
            </div>

            {/* PREMIUM PLAN */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '32px',
              border: '2px solid #3E2A9C',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                background: '#3E2A9C', 
                color: 'white', 
                padding: '4px 12px', 
                borderBottomLeftRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                ЕДНОКРАТНО
              </div>
              <h3 style={{ color: '#3E2A9C', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Главен Счетоводител</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
                49 лв.<span style={{ fontSize: '16px', color: '#6B7280', fontWeight: 'normal' }}> завинаги</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left' }}>
                {['Всички задачи (Week 1-4)', 'Сертификат', '1ч консултация', 'Доживотен достъп'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#1F2937' }}>
                    <CheckCircle size={16} color="#3E2A9C" /> {item}
                  </li>
                ))}
              </ul>
              <button style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: 'none', 
                background: '#3E2A9C', 
                color: 'white', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}>
                Купи завинаги
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ 
            marginTop: '40px', 
            textAlign: 'center', 
            color: '#6B7280', 
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} />
              <span>SSL Защита</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} />
              <span>30 дни гаранция</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={16} />
              <span>Сигурно плащане</span>
            </div>
          </div>
        </div>

        {/* Мисъл за деня */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <DailyQuote />
        </div>
      </main>

      <footer style={{ background: '#3E2A9C', color: 'white', padding: '40px', marginTop: '80px', textAlign: 'center' }}>
        <p style={{ margin: 0, opacity: 0.8 }}>© 2026 Accountify. Професионално счетоводно обучение.</p>
      </footer>
    </div>
  );
}

function StatCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(62, 42, 156, 0.08)', border: '1px solid rgba(91, 63, 214, 0.1)' }}>
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#3E2A9C', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#1F2937', fontSize: '14px', margin: 0 }}>{description}</p>
    </div>
  );
}