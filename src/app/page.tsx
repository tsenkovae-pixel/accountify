import Link from 'next/link';
import { Calculator, Sparkles, Trophy, Play, ChevronRight, CheckCircle } from 'lucide-react';
import DailyQuote from '@/components/DailyQuote';

export default function Home() {
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
          marginBottom: '40px'
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