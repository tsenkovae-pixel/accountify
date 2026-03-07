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

// ЗАДАЧИТЕ
const WEEKS_DATA: Week[] = [
  {
    id: 1,
    title: 'СЕДМИЦА 1',
    subtitle: 'Основи',
    story: 'Фирма Атрой Финанс ЕООД започва дейност. Капиталът се внася по банков път!',
    locked: false,
    tasks: [
      {
        id: 1,
        title: 'Внасяне на капитал',
        description: 'Основателят внася 10,000 лв. по банкова сметка като основен капитал.',
        document: {
          type: 'Банков документ',
          number: 'КВ №001',
          counterparty: 'Собственик',
          details: 'Внасяне на основен капитал',
          amount: 10000,
          total: 10000,
        },
        correctEntry: [{
          debit: '503',
          credit: '101',
          debitAccount: 'Разплащателна сметка',
          creditAccount: 'Основен капитал',
          explanation: 'Увеличаваме парите в банката (Дт 503) и отчитаме капитала (Кт 101)'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Пари в банка', value: 10000 },
          { description: 'Капитал', value: 10000 }
        ]
      },
      {
        id: 2,
        title: 'Теглене от банка',
        description: 'Теглене на пари от банка за каса',
        document: {
          type: 'Касов ордер',
          number: 'КО №001',
          counterparty: 'Банка',
          details: 'Теглене на пари в брой',
          amount: 2000,
          total: 2000,
        },
        correctEntry: [{
          debit: '501',
          credit: '503',
          debitAccount: 'Каса',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Увеличаваме касата (Дт 501) и намаляваме банката (Кт 503)'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Каса', value: 2000 },
          { description: 'Банкова сметка', value: -2000 }
        ]
      },
      {
        id: 3,
        title: 'Покупка на материали',
        description: 'Фактура за канцеларски материали',
        document: {
          type: 'Фактура',
          number: '№100',
          counterparty: 'Офис Снабдяване ООД',
          details: 'Канцеларски материали',
          amount: 300,
          vat: 60,
          total: 360,
          condition: 'покупка на кредит'
        },
        correctEntry: [
          { debit: '601', credit: '4531', debitAccount: 'Разходи', creditAccount: 'ДДС покупки', explanation: 'Отчитаме разхода и ДДС' },
          { debit: '601', credit: '401', debitAccount: 'Разходи', creditAccount: 'Доставчици', explanation: 'Дължим на доставчика' }
        ],
        commonMistake: { account: '302', explanation: '302 са стоки за препродажба, не консумативи (601)' },
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 300 },
          { description: 'ДДС', value: 60 },
          { description: 'Задължения', value: 360 }
        ]
      },
      {
        id: 4,
        title: 'Плащане към доставчик',
        description: 'Плащане по банка',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №001',
          counterparty: 'Офис Снабдяване ООД',
          details: 'Плащане на фактура №100',
          amount: 360,
          total: 360,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Намаляваме задължението и парите в банка'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Задължения', value: -360 },
          { description: 'Банка', value: -360 }
        ]
      },
      {
        id: 5,
        title: 'Покупка на компютър',
        description: 'Покупка на компютър за офиса',
        document: {
          type: 'Фактура',
          number: '№105',
          counterparty: 'Техно Магазин ООД',
          details: 'Компютър и периферия',
          amount: 2000,
          vat: 400,
          total: 2400,
        },
        correctEntry: [
          { debit: '203', credit: '4531', debitAccount: 'Компютърна техника', creditAccount: 'ДДС покупки', explanation: 'Отчитаме актива и ДДС' },
          { debit: '203', credit: '401', debitAccount: 'Компютърна техника', creditAccount: 'Доставчици', explanation: 'Дължим на доставчика' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Компютър', value: 2000 },
          { description: 'ДДС', value: 400 },
          { description: 'Задължения', value: 2400 }
        ]
      },
      {
        id: 6,
        title: 'Плащане на компютъра',
        description: 'Банков превод',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №002',
          counterparty: 'Техно Магазин ООД',
          details: 'Плащане на фактура №105',
          amount: 2400,
          total: 2400,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Заплащане на задължението'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Задължения', value: -2400 },
          { description: 'Банка', value: -2400 }
        ]
      },
      {
        id: 7,
        title: 'Фактура за наем',
        description: 'Фактура за офис наем',
        document: {
          type: 'Фактура',
          number: '№200',
          counterparty: 'Сити Пропъртис ООД',
          details: 'Наем офис за месец',
          amount: 1000,
          vat: 200,
          total: 1200,
        },
        correctEntry: [
          { debit: '602', credit: '4531', debitAccount: 'Разходи за услуги', creditAccount: 'ДДС покупки', explanation: 'Разход за наем' },
          { debit: '602', credit: '401', debitAccount: 'Разходи за услуги', creditAccount: 'Доставчици', explanation: 'Задължение към наемодателя' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 1000 },
          { description: 'ДДС', value: 200 },
          { description: 'Задължения', value: 1200 }
        ]
      },
      {
        id: 8,
        title: 'Плащане на наема',
        description: 'Банково плащане',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №003',
          counterparty: 'Сити Пропъртис ООД',
          details: 'Наем',
          amount: 1200,
          total: 1200,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Заплащане на наема'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Задължения', value: -1200 },
          { description: 'Банка', value: -1200 }
        ]
      },
      {
        id: 9,
        title: 'Фактура за интернет',
        description: 'Фактура за интернет',
        document: {
          type: 'Фактура',
          number: '№305',
          counterparty: 'Нет Провайдър ООД',
          details: 'Интернет',
          amount: 150,
          vat: 30,
          total: 180,
        },
        correctEntry: [
          { debit: '602', credit: '4531', debitAccount: 'Разходи', creditAccount: 'ДДС покупки', explanation: 'Разходи за комуникации' },
          { debit: '602', credit: '401', debitAccount: 'Разходи', creditAccount: 'Доставчици', explanation: 'Задължение' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 150 },
          { description: 'ДДС', value: 30 },
          { description: 'Задължения', value: 180 }
        ]
      },
      {
        id: 10,
        title: 'Плащане на интернет',
        description: 'Плащане по банка',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №004',
          counterparty: 'Нет Провайдър ООД',
          details: 'Интернет',
          amount: 180,
          total: 180,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Заплащане'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Задължения', value: -180 },
          { description: 'Банка', value: -180 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'СЕДМИЦА 2',
    subtitle: 'Покупки и продажби',
    story: 'Фирмата започва активна търговска дейност. Трябва да осчетоводиш стоки, продажби и клиенти.',
    locked: true,
    requiredLevel: 2,
    tasks: [
      {
        id: 11,
        title: 'Покупка на стоки',
        description: 'Покупка на търговски стоки',
        document: {
          type: 'Фактура',
          number: '№500',
          counterparty: 'Търговия ООД',
          details: 'Стоки за препродажба',
          amount: 5000,
          vat: 1000,
          total: 6000,
          condition: 'покупка на кредит'
        },
        correctEntry: [
          { debit: '305', credit: '4531', debitAccount: 'Стоки', creditAccount: 'ДДС покупки', explanation: 'Стоките са актив' },
          { debit: '305', credit: '401', debitAccount: 'Стоки', creditAccount: 'Доставчици', explanation: 'Дължим с ДДС' }
        ],
        commonMistake: { account: '601', explanation: '601 е за материали, 305 е за стоки' },
        xpReward: 100,
        financialImpact: [
          { description: 'Стоки', value: 5000 },
          { description: 'ДДС', value: 1000 },
          { description: 'Задължения', value: 6000 }
        ]
      },
      {
        id: 12,
        title: 'Частично плащане',
        description: 'Частично плащане към доставчик',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №010',
          counterparty: 'Търговия ООД',
          details: 'Частично плащане',
          amount: 3000,
          total: 3000,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Банка',
          explanation: 'Намаляваме задължението'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Задължения', value: -3000 },
          { description: 'Банка', value: -3000 }
        ]
      },
      {
        id: 13,
        title: 'Изплащане на остатък',
        description: 'Остатък към доставчик',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №011',
          counterparty: 'Търговия ООД',
          details: 'Остатък',
          amount: 3000,
          total: 3000,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Банка',
          explanation: 'Заплащане на остатъка'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Задължения', value: -3000 },
          { description: 'Банка', value: -3000 }
        ]
      },
      {
        id: 14,
        title: 'Продажба на стоки',
        description: 'Продажба на клиент',
        document: {
          type: 'Фактура',
          number: '№001',
          counterparty: 'Клиент ООД',
          details: 'Продажба на стоки',
          amount: 8000,
          vat: 1600,
          total: 9600,
        },
        correctEntry: [
          { debit: '411', credit: '702', debitAccount: 'Клиенти', creditAccount: 'Приходи от стоки', explanation: 'Клиентът ни дължи' },
          { debit: '411', credit: '4532', debitAccount: 'Клиенти', creditAccount: 'ДДС продажби', explanation: 'ДДС за плащане' }
        ],
        xpReward: 100,
        financialImpact: [
          { description: 'Вземания', value: 9600 },
          { description: 'Приходи', value: 8000 },
          { description: 'ДДС', value: 1600 }
        ]
      },
      {
        id: 15,
        title: 'Постъпление от клиент',
        description: 'Плащане по банка',
        document: {
          type: 'Банков документ',
          number: 'КВ №050',
          counterparty: 'Клиент ООД',
          details: 'Плащане по фактура №001',
          amount: 9600,
          total: 9600,
        },
        correctEntry: [{
          debit: '503',
          credit: '411',
          debitAccount: 'Банка',
          creditAccount: 'Клиенти',
          explanation: 'Увеличаваме парите, намаляваме вземането'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Банка', value: 9600 },
          { description: 'Вземания', value: -9600 }
        ]
      },
      {
        id: 16,
        title: 'Продажба на услуга',
        description: 'Консултантска услуга',
        document: {
          type: 'Фактура',
          number: '№002',
          counterparty: 'Фирма ЕООД',
          details: 'Счетоводна консултация',
          amount: 2000,
          vat: 400,
          total: 2400,
        },
        correctEntry: [
          { debit: '411', credit: '703', debitAccount: 'Клиенти', creditAccount: 'Приходи от услуги', explanation: 'Приход от услуги' },
          { debit: '411', credit: '4532', debitAccount: 'Клиенти', creditAccount: 'ДДС продажби', explanation: 'ДДС' }
        ],
        xpReward: 100,
        financialImpact: [
          { description: 'Вземания', value: 2400 },
          { description: 'Приходи', value: 2000 },
          { description: 'ДДС', value: 400 }
        ]
      },
      {
        id: 17,
        title: 'Касово плащане',
        description: 'Клиент плаща в брой',
        document: {
          type: 'Касов ордер',
          number: 'КО №020',
          counterparty: 'Фирма ЕООД',
          details: 'Плащане на фактура №002',
          amount: 2400,
          total: 2400,
        },
        correctEntry: [{
          debit: '501',
          credit: '411',
          debitAccount: 'Каса',
          creditAccount: 'Клиенти',
          explanation: 'Увеличаваме касата'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Каса', value: 2400 },
          { description: 'Вземания', value: -2400 }
        ]
      },
      {
        id: 18,
        title: 'Транспортни разходи',
        description: 'Фактура за транспорт',
        document: {
          type: 'Фактура',
          number: '№600',
          counterparty: 'Спедитор ЕООД',
          details: 'Транспортни услуги',
          amount: 500,
          vat: 100,
          total: 600,
        },
        correctEntry: [
          { debit: '602', credit: '4531', debitAccount: 'Разходи', creditAccount: 'ДДС покупки', explanation: 'Транспортни разходи' },
          { debit: '602', credit: '401', debitAccount: 'Разходи', creditAccount: 'Доставчици', explanation: 'Задължение' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 500 },
          { description: 'ДДС', value: 100 },
          { description: 'Задължения', value: 600 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'СЕДМИЦА 3',
    subtitle: 'Разширени операции',
    story: 'Научаваш заплати, осигуровки и амортизация. Необходимо ниво: Старши (1000 XP).',
    locked: true,
    requiredLevel: 3,
    tasks: [
      {
        id: 19,
        title: 'Начисляване на заплата',
        description: 'Заплата на управител',
        document: {
          type: 'Разчетна ведомост',
          number: '№1',
          counterparty: 'Персонал',
          details: 'Заплата управител',
          amount: 3000,
          total: 3000,
        },
        correctEntry: [{
          debit: '604',
          credit: '421',
          debitAccount: 'Разходи за заплати',
          creditAccount: 'Задължения към персонал',
          explanation: 'Начисляваме заплата'
        }],
        xpReward: 100,
        financialImpact: [
          { description: 'Разходи', value: 3000 },
          { description: 'Задължения', value: 3000 }
        ]
      },
      {
        id: 20,
        title: 'Начисляване на осигуровки',
        description: 'Осигуровки работодател',
        document: {
          type: 'Осигурителна ведомост',
          number: '№1',
          counterparty: 'НОИ',
          details: 'Осигуровки',
          amount: 750,
          total: 750,
        },
        correctEntry: [{
          debit: '605',
          credit: '461',
          debitAccount: 'Разходи за осигуровки',
          creditAccount: 'Социално осигуряване',
          explanation: 'Начисляваме осигуровки'
        }],
        xpReward: 100,
        financialImpact: [
          { description: 'Разходи', value: 750 },
          { description: 'Задължения към НОИ', value: 750 }
        ]
      },
      {
        id: 21,
        title: 'Амортизация на компютър',
        description: 'Месечна амортизация',
        document: {
          type: 'Амортизационна ведомост',
          number: '№1',
          counterparty: '-',
          details: 'Амортизация компютър',
          amount: 100,
          total: 100,
        },
        correctEntry: [{
          debit: '603',
          credit: '241',
          debitAccount: 'Разходи за амортизация',
          creditAccount: 'Амортизация ДМА',
          explanation: 'Начисляваме амортизация'
        }],
        xpReward: 125,
        financialImpact: [
          { description: 'Разходи', value: 100 },
          { description: 'Амортизация', value: -100 }
        ]
      },
      {
        id: 22,
        title: 'Плащане на заплата',
        description: 'Банков превод',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №100',
          counterparty: 'Управител',
          details: 'Заплата',
          amount: 2500,
          total: 2500,
        },
        correctEntry: [{
          debit: '421',
          credit: '503',
          debitAccount: 'Задължения към персонал',
          creditAccount: 'Банка',
          explanation: 'Плащаме заплатата (нето)'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Задължения', value: -2500 },
          { description: 'Банка', value: -2500 }
        ]
      }
    ]
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
                    <h3 style={{ margin: '0 0 8px 0' }}>Атрой Финанс ООД</h3>
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