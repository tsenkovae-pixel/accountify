'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Building2,
  ArrowRight,
  Star,
  Award,
  ChevronRight,
  FileText,
  Calculator,
  Briefcase,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { week1InternExercises } from '../data/exercises/week1Intern';
import { week2JuniorExercises } from '../data/exercises/week2Junior';

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
  commonMistake?: {
    account: string;
    explanation: string;
  };
  xpReward: number;
  financialImpact: {
    description: string;
    value: number;
  }[];
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Как работи симулаторът</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#5B21B6', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
              Следвай тези стъпки:
            </h4>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: 1.8 }}>
              <li style={{ marginBottom: '8px' }}><strong>Прочети</strong> операцията или документа</li>
              <li style={{ marginBottom: '8px' }}><strong>Избери</strong> правилните счетоводни сметки</li>
              <li style={{ marginBottom: '8px' }}><strong>Провери</strong> дали сумата съвпада</li>
              <li><strong>Натисни</strong> "Провери"</li>
            </ol>
          </div>

          <div style={{
            background: '#F3E8FF',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h4 style={{ color: '#5B21B6', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Кариера (5 нива):
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#4B5563', fontSize: '14px' }}>
              <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⭐</span> Стажант (0 XP)
              </li>
              <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⭐⭐</span> Младши (500 XP) - отключва Седмица 2
              </li>
              <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⭐⭐⭐</span> Старши (1000 XP) - отключва Седмица 3
              </li>
              <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🏆</span> Главен (2000 XP)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>👑</span> Финансов директор (3500 XP)
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Разбрах, започвам!
          </button>
        </div>
      </div>
    </div>
  );
}

// ПЪЛЕН СМЕТКОПЛАН
const ACCOUNTS = [
  // Капитали
  { code: '101', name: 'Основен капитал', type: 'capital' },
  { code: '111', name: 'Законови резерви', type: 'capital' },
  { code: '117', name: 'Резерви от печалба', type: 'capital' },
  { code: '121', name: 'Непокрита загуба', type: 'capital' },
  { code: '122', name: 'Неразпределена печалба', type: 'capital' },
  { code: '123', name: 'Текуща печалба/загуба', type: 'capital' },

  // Заеми
  { code: '151', name: 'Краткосрочни заеми', type: 'liability' },
  { code: '152', name: 'Дългосрочни заеми', type: 'liability' },
  { code: '156', name: 'Овърдрафт', type: 'liability' },

  // ДМА
  { code: '201', name: 'Земи', type: 'asset' },
  { code: '202', name: 'Сгради', type: 'asset' },
  { code: '203', name: 'Компютърна техника', type: 'asset' },
  { code: '204', name: 'Съоръжения', type: 'asset' },
  { code: '205', name: 'Машини', type: 'asset' },
  { code: '206', name: 'Транспортни средства', type: 'asset' },
  { code: '207', name: 'Офис обзавеждане', type: 'asset' },
  { code: '211', name: 'Продукти от развойна дейност', type: 'asset' },
  { code: '212', name: 'Програмни продукти', type: 'asset' },
  { code: '241', name: 'Амортизация на ДМА', type: 'asset' },

  // Запаси
  { code: '301', name: 'Доставки', type: 'asset' },
  { code: '302', name: 'Суровини', type: 'asset' },
  { code: '303', name: 'Незавършено производство', type: 'asset' },
  { code: '304', name: 'Готова продукция', type: 'asset' },
  { code: '305', name: 'Стоки', type: 'asset' },
  { code: '306', name: 'Материали', type: 'asset' },

  // Разчети
  { code: '401', name: 'Доставчици', type: 'liability' },
  { code: '402', name: 'Аванси към доставчици', type: 'asset' },
  { code: '411', name: 'Клиенти', type: 'asset' },
  { code: '412', name: 'Аванси от клиенти', type: 'liability' },
  { code: '421', name: 'Задължения към персонал', type: 'liability' },
  { code: '422', name: 'Подотчетни лица', type: 'asset' },
  { code: '441', name: 'Вземания по рекламации', type: 'asset' },
  { code: '451', name: 'Разчети за данъци', type: 'liability' },
  { code: '452', name: 'Разчети за корп. данък', type: 'liability' },
  { code: '4531', name: 'ДДС покупки', type: 'asset' },
  { code: '4532', name: 'ДДС продажби', type: 'liability' },
  { code: '4538', name: 'ДДС за възстановяване', type: 'asset' },
  { code: '4539', name: 'ДДС за внасяне', type: 'liability' },
  { code: '454', name: 'Данъци върху доходи', type: 'liability' },
  { code: '461', name: 'Социално осигуряване', type: 'liability' },
  { code: '462', name: 'Здравно осигуряване', type: 'liability' },
  { code: '498', name: 'Други дебитори', type: 'asset' },
  { code: '499', name: 'Други кредитори', type: 'liability' },

  // Пари
  { code: '501', name: 'Каса в левове', type: 'asset' },
  { code: '502', name: 'Каса във валута', type: 'asset' },
  { code: '503', name: 'Разплащателна сметка', type: 'asset' },
  { code: '504', name: 'Сметка във валута', type: 'asset' },
  { code: '505', name: 'Акредитиви', type: 'asset' },
  { code: '506', name: 'Депозити', type: 'asset' },

  // Разходи
  { code: '601', name: 'Разходи за материали', type: 'expense' },
  { code: '602', name: 'Разходи за външни услуги', type: 'expense' },
  { code: '603', name: 'Разходи за амортизация', type: 'expense' },
  { code: '604', name: 'Разходи за заплати', type: 'expense' },
  { code: '605', name: 'Разходи за осигуровки', type: 'expense' },
  { code: '606', name: 'Разходи за данъци', type: 'expense' },
  { code: '609', name: 'Други разходи', type: 'expense' },
  { code: '611', name: 'Разходи за основна дейност', type: 'expense' },
  { code: '614', name: 'Административни разходи', type: 'expense' },
  { code: '615', name: 'Разходи за продажби', type: 'expense' },
  { code: '621', name: 'Разходи за лихви', type: 'expense' },

  // Приходи
  { code: '701', name: 'Приходи от продукция', type: 'revenue' },
  { code: '702', name: 'Приходи от стоки', type: 'revenue' },
  { code: '703', name: 'Приходи от услуги', type: 'revenue' },
  { code: '704', name: 'Приходи от наеми', type: 'revenue' },
  { code: '705', name: 'Приходи от ДМА', type: 'revenue' },
  { code: '709', name: 'Други приходи', type: 'revenue' },
  { code: '721', name: 'Приходи от лихви', type: 'revenue' }
];

// НИВА НА КАРИЕРАТА
const ROLES = [
  { level: 1, title: 'Стажант счетоводител', xpNeeded: 0, icon: '⭐' },
  { level: 2, title: 'Младши счетоводител', xpNeeded: 500, icon: '⭐⭐' },
  { level: 3, title: 'Старши счетоводител', xpNeeded: 1000, icon: '⭐⭐⭐' },
  { level: 4, title: 'Главен счетоводител', xpNeeded: 2000, icon: '🏆' },
  { level: 5, title: 'Финансов директор', xpNeeded: 3500, icon: '👑' }
];

// Конвертиране на Exercise към Task формат
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
    financialImpact: [
      { description: 'Операция', value: ex.amount }
    ]
  };
};

// ЗАДАЧИТЕ - сега зареждаме от външни файлове
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
];

export default function AccountifySimulator() {
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
  const [companyStats, setCompanyStats] = useState({
    assets: 0,
    liabilities: 0,
    capital: 0
  });

  // Изчисляваме текущото ниво при промяна на XP
  useEffect(() => {
    const newLevel = ROLES.reduce((acc, role) => {
      if (playerXP >= role.xpNeeded) {
        return role.level;
      }
      return acc;
    }, 1);

    if (newLevel !== playerLevel) {
      setPlayerLevel(newLevel);
    }
  }, [playerXP]);

  // Автоматично отключване на седмици при достигане на ниво
  useEffect(() => {
    WEEKS_DATA.forEach(week => {
      if (week.requiredLevel && playerLevel >= week.requiredLevel && week.locked) {
        week.locked = false;
        if (!weeksUnlocked.includes(week.id)) {
          setWeeksUnlocked(prev => [...prev, week.id]);
        }
      }
    });
  }, [playerLevel]);

  const currentWeekData = WEEKS_DATA[currentWeek];
  const currentTaskData = currentWeekData?.tasks[currentTask];
  const progress = currentWeekData ? ((currentTask) / currentWeekData.tasks.length) * 100 : 0;
  const currentRole = ROLES.find(r => r.level === playerLevel) || ROLES[0];
  const nextRole = ROLES.find(r => r.level === playerLevel + 1);

  const calculateCompanyStats = () => {
    let assets = 10000;
    let liabilities = 0;

    completedTasks.forEach(taskId => {
      WEEKS_DATA.forEach(week => {
        const task = week.tasks.find(t => t.id === taskId);
        if (task) {
          task.financialImpact.forEach(impact => {
            if (impact.description.includes('Задължения') || impact.description.includes('НОИ') || impact.description.includes('персонал')) {
              liabilities += impact.value;
            } else if (!impact.description.includes('Приходи') && !impact.description.includes('Разходи')) {
              assets += impact.value;
            }
          });
        }
      });
    });

    setCompanyStats({
      assets,
      liabilities,
      capital: assets - liabilities
    });
  };

  const handleCheckAnswer = () => {
    if (!currentTaskData) return;

    const isCorrect = currentTaskData.correctEntry.some(entry => 
      entry.debit === selectedDebit && entry.credit === selectedCredit
    );

    if (isCorrect) {
      setFeedback('correct');
      const newXP = playerXP + currentTaskData.xpReward;
      setPlayerXP(newXP);
      setCompletedTasks(prev => [...prev, currentTaskData.id]);
      calculateCompanyStats();
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

  const getAccountName = (code: string) => {
    return ACCOUNTS.find(a => a.code === code)?.name || code;
  };

  const isCommonMistake = (debit: string, credit: string) => {
    return currentTaskData?.commonMistake && 
           (debit === currentTaskData.commonMistake.account || 
            credit === currentTaskData.commonMistake.account);
  };

  // MENU VIEW
  if (gameState === 'menu') {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FAF9F7 0%, #F3E8FF 50%, #FAF9F7 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px 20px'
      }}>
        <InstructionsPopup isOpen={showInstructions} onClose={() => setShowInstructions(false)} />

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
            borderRadius: '20px',
            padding: '40px',
            color: 'white',
            marginBottom: '32px',
            boxShadow: '0 10px 40px rgba(91, 33, 182, 0.3)',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              ACCOUNTIFY
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.9, margin: '0 0 24px 0' }}>
              Професионален симулатор по българско счетоводство
            </p>

            {/* Level Display */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '16px 24px', 
                borderRadius: '16px',
                minWidth: '150px'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{currentRole.icon}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Ниво {playerLevel}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{currentRole.title}</div>
              </div>

              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '16px 24px', 
                borderRadius: '16px',
                minWidth: '150px'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Опит (XP)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{playerXP}</div>
                {nextRole && (
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>
                    до {nextRole.title}: {nextRole.xpNeeded - playerXP} XP
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowInstructions(true)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <HelpCircle size={20} />
                Инструкции
              </button>
            </div>
          </div>

          {/* Weeks */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {WEEKS_DATA.map((week, index) => (
              <div 
                key={week.id}
                style={{
                  background: week.locked ? '#F3F4F6' : 'white',
                  borderRadius: '16px',
                  padding: '28px',
                  border: `2px solid ${week.locked ? '#E5E7EB' : weeksUnlocked.includes(week.id) ? '#10B981' : '#D4AF37'}`,
                  boxShadow: week.locked ? 'none' : '0 4px 15px rgba(0,0,0,0.05)',
                  opacity: week.locked ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: week.locked ? '#9CA3AF' : 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {week.locked ? <Lock size={28} /> : <BookOpen size={28} />}
                    </div>
                    <div>
                      <h2 style={{ margin: '0 0 4px 0', color: week.locked ? '#6B7280' : '#111827', fontSize: '20px' }}>
                        {week.title}
                      </h2>
                      <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>{week.subtitle}</p>
                      {week.locked && week.requiredLevel && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#D97706' }}>
                          🔒 Изисква: {ROLES.find(r => r.level === week.requiredLevel)?.title} ({ROLES.find(r => r.level === week.requiredLevel)?.xpNeeded} XP)
                        </p>
                      )}
                      {!week.locked && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#10B981' }}>
                          ✅ {week.tasks.length} задачи
                        </p>
                      )}
                    </div>
                  </div>

                  {week.locked ? (
                    <span style={{ 
                      background: '#E5E7EB', 
                      color: '#6B7280', 
                      padding: '12px 20px', 
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Lock size={16} />
                      Заключено
                    </span>
                  ) : (
                    <button 
                      onClick={() => startWeek(index)}
                      style={{
                        background: weeksUnlocked.includes(week.id) 
                          ? '#10B981' 
                          : 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px'
                      }}
                    >
                      {weeksUnlocked.includes(week.id) ? 'Продължи' : 'Започни'}
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>

                {!week.locked && (
                  <div style={{ marginTop: '16px', padding: '12px 16px', background: '#F3E8FF', borderRadius: '8px', fontSize: '14px', color: '#5B21B6' }}>
                    {week.story}
                  </div>
                )}
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FAF9F7 0%, #F3E8FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '48px', borderRadius: '20px', textAlign: 'center', maxWidth: '400px' }}>
          <Lock size={64} style={{ color: '#D4AF37', marginBottom: '24px' }} />
          <h2 style={{ color: '#111827', marginBottom: '12px' }}>Заключено съдържание</h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            Трябва да достигнеш по-високо ниво за да продължиш.
          </p>
          <button 
            onClick={() => setGameState('menu')}
            style={{
              background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Обратно към менюто
          </button>
        </div>
      </div>
    );
  }

  // COMPLETED VIEW
  if (gameState === 'completed') {
    const totalXP = currentWeekData.tasks.reduce((acc, t) => acc + t.xpReward, 0);
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '48px', borderRadius: '20px', maxWidth: '600px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <CheckCircle size={64} color="#10B981" style={{ marginBottom: '16px' }} />
            <h2 style={{ color: '#111827', marginBottom: '8px' }}>Поздравления!</h2>
            <p style={{ color: '#6B7280' }}>Завърши {currentWeekData.title}</p>
            <div style={{ marginTop: '16px', padding: '8px 16px', background: '#F3E8FF', color: '#5B21B6', borderRadius: '20px', display: 'inline-block', fontWeight: 'bold' }}>
              +{totalXP} XP
            </div>
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: '#111827', marginBottom: '16px', fontSize: '16px' }}>
              <Building2 size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Финансово състояние
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Активи</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981' }}>{companyStats.assets.toLocaleString()} лв</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Задължения</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF4444' }}>{companyStats.liabilities.toLocaleString()} лв</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Капитал</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3B82F6' }}>{companyStats.capital.toLocaleString()} лв</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setGameState('menu')}
              style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Към менюто
            </button>
            {currentWeek < WEEKS_DATA.length - 1 && !WEEKS_DATA[currentWeek + 1].locked && (
              <button 
                onClick={() => startWeek(currentWeek + 1)}
                style={{ flex: 1, background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)', color: 'white', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Следваща седмица →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // GAME VIEW
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FAF9F7 0%, #F3E8FF 50%, #FAF9F7 100%)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setGameState('menu')}
                style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
              >
                ← Меню
              </button>
              <h1 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>
                {currentWeekData.title} – {currentWeekData.subtitle}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#F3E8FF', color: '#5B21B6', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {currentRole.icon} {currentRole.title}
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{playerXP}</span> XP
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', minWidth: '80px' }}>
              Задача {currentTask + 1}/{currentWeekData.tasks.length}
            </span>
            <div style={{ flex: 1, height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #5B21B6 0%, #7C3AED 100%)', borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280', minWidth: '40px', textAlign: 'right' }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* Left Column */}
          <div>
            {/* Story */}
            {currentTask === 0 && (
              <div style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)', color: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>Пиксел Солюшънс ООД</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>{currentWeekData.story}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document */}
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
              <div style={{ background: '#F9FAFB', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6B7280" />
                  <span style={{ fontWeight: '600', color: '#374151' }}>{currentTaskData.document.type}</span>
                  <span style={{ color: '#9CA3AF' }}>|</span>
                  <span style={{ fontFamily: 'monospace', color: '#6B7280' }}>{currentTaskData.document.number}</span>
                </div>
                <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{new Date().toLocaleDateString('bg-BG')}</span>
              </div>

              <div style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Контрагент:</div>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '18px' }}>{currentTaskData.document.counterparty}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Сума:</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#5B21B6' }}>
                      {currentTaskData.document.amount.toLocaleString()} лв.
                    </div>
                    {currentTaskData.document.vat && (
                      <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>+ ДДС: {currentTaskData.document.vat} лв.</div>
                    )}
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginTop: '8px' }}>
                      Общо: {currentTaskData.document.total.toLocaleString()} лв.
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Описание:</div>
                  <div style={{ fontSize: '16px', color: '#111827' }}>{currentTaskData.document.details}</div>
                  {currentTaskData.document.condition && (
                    <div style={{ marginTop: '12px', fontSize: '13px', color: '#7C3AED', fontWeight: '500' }}>
                      Условие: {currentTaskData.document.condition}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
              <h3 style={{ color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={20} color="#5B21B6" />
                {currentTaskData.title}
              </h3>
              <p style={{ color: '#6B7280', margin: 0 }}>{currentTaskData.description}</p>
            </div>

            {/* Feedback */}
            {showExplanation && (
              <div style={{ background: feedback === 'correct' ? '#F0FDF4' : '#FEF2F2', border: `2px solid ${feedback === 'correct' ? '#16A34A' : '#DC2626'}`, borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: feedback === 'correct' ? '#16A34A' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    {feedback === 'correct' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: feedback === 'correct' ? '#166534' : '#991B1B', margin: '0 0 8px 0', fontSize: '20px' }}>
                      {feedback === 'correct' ? '✓ Вярно!' : '✘ Грешка'}
                    </h4>

                    {feedback === 'correct' && (
                      <div style={{ display: 'inline-block', background: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
                        +{currentTaskData.xpReward} XP
                      </div>
                    )}

                    {feedback === 'incorrect' && isCommonMistake(selectedDebit, selectedCredit) && (
                      <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px', marginBottom: '12px', fontSize: '14px' }}>
                        <strong style={{ color: '#92400E' }}>⚠ Честа грешка:</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#78350F' }}>{currentTaskData.commonMistake?.explanation}</p>
                      </div>
                    )}

                    <div style={{ color: '#374151', lineHeight: 1.6 }}>
                      {currentTaskData.correctEntry.map((entry, idx) => (
                        <p key={idx} style={{ margin: '0 0 8px 0' }}>{entry.explanation}</p>
                      ))}
                    </div>

                    {feedback === 'correct' && (
                      <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '13px', color: '#166534', fontWeight: '600', marginBottom: '8px' }}>📊 Ефект върху фирмата:</div>
                        {currentTaskData.financialImpact.map((impact, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                            <span style={{ color: '#6B7280' }}>{impact.description}:</span>
                            <span style={{ color: impact.value > 0 ? '#16A34A' : '#DC2626', fontWeight: '600' }}>
                              {impact.value > 0 ? '+' : ''}{impact.value.toLocaleString()} лв
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={feedback === 'correct' ? handleNextTask : resetTask}
                      style={{ marginTop: '16px', background: feedback === 'correct' ? '#16A34A' : '#374151', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {feedback === 'correct' ? 'Продължи →' : 'Опитай отново'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Journal Entry */}
          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', position: 'sticky', top: '100px' }}>
              <h3 style={{ color: '#111827', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="#5B21B6" />
                Счетоводна статия
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Debit */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Дебит (Дт)
                  </label>
                  <select 
                    value={selectedDebit}
                    onChange={(e) => setSelectedDebit(e.target.value)}
                    disabled={showExplanation}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #E5E7EB', fontSize: '14px', backgroundColor: showExplanation ? '#F3F4F6' : 'white' }}
                  >
                    <option value="">Избери сметка...</option>
                    {ACCOUNTS.map(account => (
                      <option key={account.code} value={account.code}>
                        {account.code} – {account.name}
                      </option>
                    ))}
                  </select>
                  {selectedDebit && (
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#5B21B6' }}>
                      {getAccountName(selectedDebit)}
                    </div>
                  )}
                </div>

                {/* Credit */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Кредит (Кт)
                  </label>
                  <select 
                    value={selectedCredit}
                    onChange={(e) => setSelectedCredit(e.target.value)}
                    disabled={showExplanation}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #E5E7EB', fontSize: '14px', backgroundColor: showExplanation ? '#F3F4F6' : 'white' }}
                  >
                    <option value="">Избери сметка...</option>
                    {ACCOUNTS.map(account => (
                      <option key={account.code} value={account.code}>
                        {account.code} – {account.name}
                      </option>
                    ))}
                  </select>
                  {selectedCredit && (
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#5B21B6' }}>
                      {getAccountName(selectedCredit)}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '2px solid #F59E0B', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#92400E', marginBottom: '4px' }}>Сума:</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400E' }}>
                    {currentTaskData.document.total.toLocaleString()} лв.
                  </div>
                </div>

                <button 
                  onClick={handleCheckAnswer}
                  disabled={!selectedDebit || !selectedCredit || showExplanation}
                  style={{ width: '100%', padding: '16px', background: (!selectedDebit || !selectedCredit || showExplanation) ? '#D1D5DB' : 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: (!selectedDebit || !selectedCredit || showExplanation) ? 'not-allowed' : 'pointer' }}
                >
                  {showExplanation ? 'Проверено' : 'Провери отговора'}
                </button>

                <div style={{ background: '#F3E8FF', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#5B21B6', lineHeight: 1.5 }}>
                  <strong>💡 Подсказка:</strong> Активите се увеличават по дебит (Дт), капиталът и задълженията – по кредит (Кт).
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}