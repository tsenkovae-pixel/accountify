'use client';

import { useEffect, useState } from 'react';
import { getProgress, canUnlockLevel, getCompletedCountForLevel } from '@/lib/progress';
import { Lock, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ExamGateProps {
  level: number; // 1, 2, 3 или 4
  levelName: string; // "Младши Счетоводител", "Старши Счетоводител" и т.н.
  children: React.ReactNode; // Съдържанието което се показва ако има достъп
}

export default function ExamGate({ level, levelName, children }: ExamGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(8); // Стандартно 8 задачи
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const progress = getProgress();
      const requiredForThisLevel = level; // Ниво 2 изисква ниво 1 да е завършено
      const access = canUnlockLevel(requiredForThisLevel);
      
      setHasAccess(access);
      setCompleted(getCompletedCountForLevel(level - 1));
      setTotal(level === 2 ? 8 : 7); // Ниво 2 иска 8 задачи, Ниво 3 иска 7
      setLoading(false);
    };
    
    checkAccess();
  }, [level]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Зареждане...</div>;
  }

  if (!hasAccess) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '24px', 
          padding: '48px', 
          maxWidth: '500px', 
          width: '100%',
          textAlign: 'center',
          border: '2px solid #E5E7EB',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#F3F0FF', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Lock size={40} color="#5B3FD6" />
          </div>
          
          <h2 style={{ color: '#3E2A9C', fontSize: '28px', marginBottom: '8px' }}>
            {levelName} е заключено
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '32px' }}>
            Завърши предишното ниво за да отключиш това.
          </p>

          <div style={{ 
            background: '#F9FAFB', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#374151', fontWeight: '600' }}>Напредък:</span>
              <span style={{ color: '#5B3FD6', fontWeight: 'bold' }}>{completed} / {total} задачи</span>
            </div>
            
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: '#E5E7EB', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(completed / total) * 100}%`, 
                height: '100%', 
                background: '#5B3FD6',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
            
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '12px' }}>
              Остават {total - completed} задачи за отключване
            </p>
          </div>

          <Link href="/simulator">
            <button style={{
              background: '#5B3FD6',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              justifyContent: 'center'
            }}>
              Продължи обучението
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Ако има достъп, покажи съдържанието + бейдж че е отключено
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
        border: '1px solid #059669',
        borderRadius: '12px',
        padding: '12px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#059669',
        fontWeight: '600'
      }}>
        <Trophy size={20} />
        <span>Отключено! {levelName}</span>
      </div>
      {children}
    </div>
  );
}