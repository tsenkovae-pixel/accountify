'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, CheckCircle, XCircle, BookOpen, Building2, ChevronRight, FileText, Calculator, HelpCircle } from 'lucide-react';
import { week1InternExercises } from '../data/exercises/week1Intern';
import { week2JuniorExercises } from '../data/exercises/week2Junior';
import { accountLabels } from '../data/config/accountLabels';

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  document: {
    type: string;
    number: string;
    counterparty: string;
    details: string;
    amount: number;
    vat?: number;
    total: number;
    condition?: string;
  };
  correctEntry: {
    debit: string;
    credit: string;
    debitAccount: string;
    creditAccount: string;
    explanation: string;
  }[];
  commonMistake?: { account: string; explanation: string; };
  xpReward: number;
  financialImpact: { description: string; value: number; }[];
}

interface Week {
  id: number;
  title: string;
  subtitle: string;
  story: string;
  locked: boolean;
  tasks: Task[];
  requiredLevel?: number;
}

// Popup Component
function InstructionsPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '16px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)', color: 'white', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Как работи симулаторът</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: 1.8 }}>
            <li>Прочети операцията</li>
            <li>Избери сметките (има tooltips!)</li>
            <li>Провери отговора</li>
          </ol>
          <button onClick={onClose} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
            Разбрах!
          </button>
        </div>
      </div>
    </div>
  );
}// ПЪЛЕН СМЕТКОПЛАН
const ACCOUNTS = [
  { code: '101', name: 'Основен капитал', type: 'capital' },
  { code: '111', name: 'Законови резерви', type: 'capital' },
  { code: '117', name: 'Резерви от печалба', type: 'capital' },
  { code: '121', name: 'Непокрита загуба', type: 'capital' },
  { code: '122', name: 'Неразпределена печалба', type: 'capital' },
  { code: '123', name: 'Текуща печалба/загуба', type: 'capital' },
  { code: '151', name: 'Краткосрочни заеми', type: 'liability' },
  { code: '152', name: 'Дългосрочни заеми', type: 'liability' },
  { code: '201', name: 'Земи', type: 'asset' },
  { code: '202', name: 'Сгради', type: 'asset' },
  { code: '203', name: 'Компютърна техника', type: 'asset' },
  { code: '204', name: 'Съоръжения', type: 'asset' },
  { code: '205', name: 'Машини', type: 'asset' },
  { code: '206', name: 'Транспортни средства', type: 'asset' },
  { code: '241', name: 'Амортизация на ДМА', type: 'asset' },
  { code: '301', name: 'Доставки', type: 'asset' },
  { code: '302', name: 'Суровини', type: 'asset' },
  { code: '304', name: 'Готова продукция', type: 'asset' },
  { code: '305', name: 'Стоки', type: 'asset' },
  { code: '401', name: 'Доставчици', type: 'liability' },
  { code: '411', name: 'Клиенти', type: 'asset' },
  { code: '412', name: 'Аванси от клиенти', type: 'liability' },
  { code: '421', name: 'Задължения към персонал', type: 'liability' },
  { code: '422', name: 'Подотчетни лица', type: 'asset' },
  { code: '4531', name: 'ДДС покупки', type: 'asset' },
  { code: '4532', name: 'ДДС продажби', type: 'liability' },
  { code: '4538', name: 'ДДС за възстановяване', type: 'asset' },
  { code: '461', name: 'Социално осигуряване', type: 'liability' },
  { code: '501', name: 'Каса в левове', type: 'asset' },
  { code: '503', name: 'Разплащателна сметка', type: 'asset' },
  { code: '601', name: 'Разходи за материали', type: 'expense' },
  { code: '602', name: 'Разходи за външни услуги', type: 'expense' },
  { code: '603', name: 'Разходи за амортизация', type: 'expense' },
  { code: '604', name: 'Разходи за заплати', type: 'expense' },
  { code: '605', name: 'Разходи за осигуровки', type: 'expense' },
  { code: '701', name: 'Приходи от продукция', type: 'revenue' },
  { code: '702', name: 'Приходи от стоки', type: 'revenue' },
  { code: '703', name: 'Приходи от услуги', type: 'revenue' },
  { code: '704', name: 'Приходи от наеми', type: 'revenue' },
];

// НИВА НА КАРИЕРАТА
const ROLES = [
  { level: 1, title: 'Стажант счетоводител', xpNeeded: 0, icon: '⭐' },
  { level: 2, title: 'Младши счетоводител', xpNeeded: 500, icon: '⭐⭐' },
  { level: 3, title: 'Старши счетоводител', xpNeeded: 1000, icon: '⭐⭐⭐' },
  { level: 4, title: 'Главен счетоводител', xpNeeded: 2000, icon: '🏆' },
  { level: 5, title: 'Финансов директор', xpNeeded: 3500, icon: '👑' }
];// Компонент за избор на сметка с Tooltip
function AccountSelect({ 
  value, 
  onChange, 
  disabled, 
  label 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  disabled: boolean;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredAccount, setHoveredAccount] = useState<string | null>(null);
  
  const selectedAccount = ACCOUNTS.find(a => a.code === value);

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
        {label}
      </label>
      
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{ 
          width: '100%', 
          padding: '12px', 
          borderRadius: '8px', 
          border: '2px solid #E5E7EB', 
          fontSize: '14px', 
          backgroundColor: disabled ? '#F3F4F6' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left'
        }}
      >
        <span style={{ color: value ? '#111827' : '#9CA3AF' }}>
          {value ? `${value} – ${selectedAccount?.name}` : 'Избери сметка...'}
        </span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {isOpen && !disabled && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsOpen(false)} />
          <div style={{ 
            position: 'absolute', 
            top: 'calc(100% + 4px)', 
            left: 0, right: 0, 
            background: 'white', 
            border: '2px solid #E5E7EB', 
            borderRadius: '8px', 
            maxHeight: '300px', 
            overflow: 'auto',
            zIndex: 50,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            {ACCOUNTS.map(account => (
              <div
                key={account.code}
                onClick={() => {
                  onChange(account.code);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredAccount(account.code)}
                onMouseLeave={() => setHoveredAccount(null)}
                style={{ 
                  padding: '12px 16px', 
                  cursor: 'pointer',
                  backgroundColor: value === account.code ? '#F3E8FF' : hoveredAccount === account.code ? '#F9FAFB' : 'white',
                  borderBottom: '1px solid #F3F4F6'
                }}
              >
                <span style={{ fontWeight: 'bold', color: value === account.code ? '#5B21B6' : '#374151' }}>{account.code}</span>
                <span style={{ color: value === account.code ? '#5B21B6' : '#6B7280' }}> – {account.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TOOLTIP */}
{hoveredAccount && accountLabels[hoveredAccount] && (
  <div style={{
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: '#1F2937',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    zIndex: 60,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }}>
    <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#FCD34D' }}>
      {hoveredAccount}
    </div>
    <div style={{ lineHeight: 1.4 }}>
      {accountLabels[hoveredAccount]}
    </div>
          <div style={{ lineHeight: 1.4 }}>
            {accountLabels[hoveredAccount]}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #1F2937'
          }} />
        </div>
      )}
    </div>
  );
}// Конвертиране на Exercise към Task формат
const convertExerciseToTask = (ex: any, index: number): Task => {
  const isComplexEntry = Array.isArray(ex.correctEntry);
  const entry = isComplexEntry ? ex.correctEntry[0] : ex.correctEntry;
  
  return {
    id: index + 1,
    title: ex.title,
    description: ex.scenario,
    document: {
      type: ex.documentType,
      number: `№${String(index + 1).padStart(3, '0')}`,
      counterparty: ex.counterparty,
      details: ex.title,
      amount: ex.amount,
      vat: ex.vatAmount,
      total: ex.totalAmount || ex.amount,
      condition: ex.hint
    },
    correctEntry: isComplexEntry 
      ? ex.correctEntry.map((e: any) => ({
          debit: typeof e.debit === 'string' ? e.debit : e.debit[0],
          credit: typeof e.credit === 'string' ? e.credit : e.credit[0],
          debitAccount: ACCOUNTS.find(a => a.code === (typeof e.debit === 'string' ? e.debit : e.debit[0]))?.name || e.debit,
          creditAccount: ACCOUNTS.find(a => a.code === (typeof e.credit === 'string' ? e.credit : e.credit[0]))?.name || e.credit,
          explanation: ex.explanation
        }))
      : [{
          debit: entry.debit,
          credit: entry.credit,
          debitAccount: ACCOUNTS.find(a => a.code === entry.debit)?.name || entry.debit,
          creditAccount: ACCOUNTS.find(a => a.code === entry.credit)?.name || entry.credit,
          explanation: ex.explanation
        }],
    xpReward: 50 + (ex.level === 'junior' ? 25 : 0),
    financialImpact: [{ description: 'Операция', value: ex.amount }]
  };
};

// ЗАДАЧИТЕ
const WEEKS_DATA: Week[] = [
  {
    id: 1,
    title: 'СЕДМИЦА 1',
    subtitle: 'Основи',
    story: 'Фирма Пиксел Солюшънс ООД започва дейност. Капиталът се внася по банков път!',
    locked: false,
    tasks: week1InternExercises.map((ex, i) => convertExerciseToTask(ex, i))
  },
  {
    id: 2,
    title: 'СЕДМИЦА 2',
    subtitle: 'Покупки и продажби с ДДС',
    story: 'Фирмата започва активна търговска дейност с ДДС, ЕС операции и износ.',
    locked: true,
    requiredLevel: 2,
    tasks: week2JuniorExercises.map((ex, i) => convertExerciseToTask(ex, i + 10))
  }
];export default function AccountifySimulator() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [selectedDebit, setSelectedDebit] = useState('');
  const [selectedCredit, setSelectedCredit] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [weeksUnlocked, setWeeksUnlocked] = useState<number[]>([1]);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed' | 'locked'>('menu');
  const [companyStats, setCompanyStats] = useState({ assets: 0, liabilities: 0, capital: 0 });

  useEffect(() => {
    const newLevel = ROLES.reduce((acc, role) => playerXP >= role.xpNeeded ? role.level : acc, 1);
    if (newLevel !== playerLevel) setPlayerLevel(newLevel);
  }, [playerXP, playerLevel]);

  useEffect(() => {
    WEEKS_DATA.forEach(week => {
      if (week.requiredLevel && playerLevel >= week.requiredLevel && week.locked) {
        week.locked = false;
        if (!weeksUnlocked.includes(week.id)) setWeeksUnlocked(prev => [...prev, week.id]);
      }
    });
  }, [playerLevel, weeksUnlocked]);

  const currentWeekData = WEEKS_DATA[currentWeek];
  const currentTaskData = currentWeekData?.tasks[currentTask];
  const progress = currentWeekData ? ((currentTask) / currentWeekData.tasks.length) * 100 : 0;
  const currentRole = ROLES.find(r => r.level === playerLevel) || ROLES[0];
  const nextRole = ROLES.find(r => r.level === playerLevel + 1);

  const handleCheckAnswer = () => {
    if (!currentTaskData) return;
    const isCorrect = currentTaskData.correctEntry.some(entry => entry.debit === selectedDebit && entry.credit === selectedCredit);
    if (isCorrect) {
      setFeedback('correct');
      setPlayerXP(prev => prev + currentTaskData.xpReward);
      setCompletedTasks(prev => [...prev, currentTaskData.id]);
    } else {
      setFeedback('incorrect');
    }
    setShowExplanation(true);
  };

  const handleNextTask = () => {
    if (currentTask < currentWeekData.tasks.length - 1) {
      setCurrentTask(prev => prev + 1);
      resetTask();
    } else {
      setGameState('completed');
    }
  };

  const resetTask = () => {
    setSelectedDebit('');
    setSelectedCredit('');
    setFeedback(null);
    setShowExplanation(false);
  };

  const startWeek = (weekIndex: number) => {
    if (WEEKS_DATA[weekIndex].locked) {
      setGameState('locked');
      return;
    }
    setCurrentWeek(weekIndex);
    setCurrentTask(0);
    setGameState('playing');
    resetTask();
  };

  // MENU VIEW
  if (gameState === 'menu') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FAF9F7 0%, #F3E8FF 50%, #FAF9F7 100%)', fontFamily: 'system-ui, sans-serif', padding: '32px 20px' }}>
        <InstructionsPopup isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)', borderRadius: '20px', padding: '40px', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 8px 0' }}>ACCOUNTIFY</h1>
            <p style={{ fontSize: '18px', opacity: 0.9 }}>Професионален симулатор по българско счетоводство</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px 24px', borderRadius: '16px' }}>
                <div>{currentRole.icon}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Ниво {playerLevel}</div>
                <div style={{ fontWeight: 'bold' }}>{currentRole.title}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px 24px', borderRadius: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{playerXP}</div>
                <div style={{ fontSize: '12px' }}>XP</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {WEEKS_DATA.map((week, index) => (
              <div key={week.id} style={{ background: week.locked ? '#F3F4F6' : 'white', borderRadius: '16px', padding: '28px', border: `2px solid ${week.locked ? '#E5E7EB' : '#D4AF37'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px 0', color: week.locked ? '#6B7280' : '#111827' }}>{week.title}</h2>
                    <p style={{ margin: 0, color: '#6B7280' }}>{week.subtitle} – {week.tasks.length} задачи</p>
                  </div>
                  {week.locked ? (
                    <span style={{ background: '#E5E7EB', color: '#6B7280', padding: '12px 20px', borderRadius: '8px' }}>🔒 Заключено</span>
                  ) : (
                    <button onClick={() => startWeek(index)} style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer' }}>
                      {weeksUnlocked.includes(week.id) ? 'Продължи' : 'Започни'} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // LOCKED VIEW
  if (gameState === 'locked') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🔒</div>
          <h2>Заключено съдържание</h2>
          <button onClick={() => setGameState('menu')} style={{ background: '#5B21B6', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px' }}>Назад</button>
        </div>
      </div>
    );
  }

  // COMPLETED VIEW
  if (gameState === 'completed') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '48px', borderRadius: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🎉</div>
          <h2>Поздравления!</h2>
          <p>Завърши {currentWeekData.title}</p>
          <button onClick={() => setGameState('menu')} style={{ background: '#5B21B6', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', marginTop: '20px' }}>Към менюто</button>
        </div>
      </div>
    );
  }

  // GAME VIEW
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FAF9F7 0%, #F3E8FF 50%, #FAF9F7 100%)' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setGameState('menu')}>← Меню</button>
          <h1>{currentWeekData.title}</h1>
          <div>⭐ {playerXP} XP</div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '16px auto 0', height: '8px', background: '#E5E7EB', borderRadius: '4px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#5B21B6', borderRadius: '4px' }} />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        <div>
          {/* Тук е документът и описанието на задачата */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <h3>{currentTaskData.title}</h3>
            <p>{currentTaskData.description}</p>
            <div style={{ background: '#F3E8FF', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
              <strong>Сума:</strong> {currentTaskData.document.total.toLocaleString()} лв.
            </div>
          </div>

          {/* Feedback */}
          {showExplanation && (
            <div style={{ background: feedback === 'correct' ? '#F0FDF4' : '#FEF2F2', border: `2px solid ${feedback === 'correct' ? '#16A34A' : '#DC2626'}`, borderRadius: '16px', padding: '24px' }}>
              <h4>{feedback === 'correct' ? '✓ Вярно!' : '✘ Грешка'}</h4>
              <p>{currentTaskData.correctEntry[0].explanation}</p>
              <button onClick={feedback === 'correct' ? handleNextTask : resetTask} style={{ background: feedback === 'correct' ? '#16A34A' : '#374151', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px' }}>
                {feedback === 'correct' ? 'Продължи →' : 'Опитай отново'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Journal Entry С TOOLTIPS! */}
        <div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3>📖 Счетоводна статия</h3>
            
            {/* ТУК Е НОВИЯТ КОМПОНЕНТ С TOOLTIPS! */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
              <AccountSelect
                label="Дебит (Дт)"
                value={selectedDebit}
                onChange={setSelectedDebit}
                disabled={showExplanation}
              />

              <AccountSelect
                label="Кредит (Кт)"
                value={selectedCredit}
                onChange={setSelectedCredit}
                disabled={showExplanation}
              />

              <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '2px solid #F59E0B', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400E' }}>
                  {currentTaskData.document.total.toLocaleString()} лв.
                </div>
              </div>

              <button 
                onClick={handleCheckAnswer}
                disabled={!selectedDebit || !selectedCredit || showExplanation}
                style={{ 
                  padding: '16px', 
                  background: (!selectedDebit || !selectedCredit || showExplanation) ? '#D1D5DB' : 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 'bold',
                  cursor: (!selectedDebit || !selectedCredit || showExplanation) ? 'not-allowed' : 'pointer'
                }}
              >
                Провери отговора
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}