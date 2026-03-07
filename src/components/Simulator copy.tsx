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
  Briefcase
} from 'lucide-react';

// Types
interface JournalEntry {
  debit: string;
  credit: string;
  amount: number;
  description: string;
}

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

// Bulgarian Chart of Accounts Data
const ACCOUNTS = [
  { code: '101', name: 'Основен капитал', type: 'capital' },
  { code: '501', name: 'Каса', type: 'asset' },
  { code: '503', name: 'Разплащателна сметка', type: 'asset' },
  { code: '302', name: 'Стоки', type: 'asset' },
  { code: '204', name: 'Компютри и оборудване', type: 'asset' },
  { code: '401', name: 'Доставчици', type: 'liability' },
  { code: '411', name: 'Клиенти', type: 'asset' },
  { code: '601', name: 'Разходи за материали', type: 'expense' },
  { code: '602', name: 'Разходи за външни услуги', type: 'expense' },
  { code: '703', name: 'Приходи от продажба на стоки', type: 'revenue' },
  { code: '705', name: 'Приходи от услуги', type: 'revenue' },
  { code: '4531', name: 'ДДС покупки', type: 'asset' },
  { code: '4532', name: 'ДДС продажби', type: 'liability' },
];

const WEEKS: Week[] = [
  {
    id: 1,
    title: 'СЕДМИЦА 1',
    subtitle: 'Основи',
    story: 'Фирма Алфа Трейд ООД започва дейност. Ти си новият счетоводител и трябва да осчетоводиш първите операции.',
    locked: false,
    tasks: [
      {
        id: 1,
        title: 'Внасяне на капитал',
        description: 'Собственикът внася капитал по банковата сметка',
        document: {
          type: 'Банков документ',
          number: 'КВ №001',
          counterparty: 'Собственик',
          details: 'Внасяне на основен капитал',
          amount: 20000,
          total: 20000,
        },
        correctEntry: [{
          debit: '503',
          credit: '101',
          debitAccount: 'Разплащателна сметка',
          creditAccount: 'Основен капитал',
          explanation: 'Увеличаваме парите в банката (Дт) и отчитаме капитала (Кт)'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Пари в банка', value: 20000 },
          { description: 'Капитал', value: 20000 }
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
          explanation: 'Увеличаваме касата (Дт) и намаляваме банката (Кт)'
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
          { debit: '601', credit: '4531', debitAccount: 'Разходи за материали', creditAccount: 'ДДС покупки', explanation: 'Отчитаме разхода и ДДС-то' },
          { debit: '601', credit: '401', debitAccount: 'Разходи за материали', creditAccount: 'Доставчици', explanation: 'Дължим на доставчика общо 360 лв.' }
        ],
        commonMistake: { account: '302', explanation: 'Стоки са само търговски стоки за препродажба, не консумативи' },
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 300 },
          { description: 'ДДС за възстановяване', value: 60 },
          { description: 'Задължения', value: 360 }
        ]
      },
      {
        id: 4,
        title: 'Плащане към доставчик',
        description: 'Плащане към доставчик по банка',
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
          explanation: 'Намаляваме задължението (Дт) и парите в банка (Кт)'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Задължения', value: -360 },
          { description: 'Банкова сметка', value: -360 }
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
          { debit: '204', credit: '4531', debitAccount: 'Компютри и оборудване', creditAccount: 'ДДС покупки', explanation: 'Отчитаме актива и ДДС' },
          { debit: '204', credit: '401', debitAccount: 'Компютри и оборудване', creditAccount: 'Доставчици', explanation: 'Дължим на доставчика' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'ДМА (компютър)', value: 2000 },
          { description: 'ДДС за възстановяване', value: 400 },
          { description: 'Задължения', value: 2400 }
        ]
      },
      {
        id: 6,
        title: 'Плащане на компютъра',
        description: 'Плащане на компютъра по банков път',
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
          { description: 'Банкова сметка', value: -2400 }
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
          { debit: '602', credit: '4531', debitAccount: 'Разходи за външни услуги', creditAccount: 'ДДС покупки', explanation: 'Отчитаме разхода за наем' },
          { debit: '602', credit: '401', debitAccount: 'Разходи за външни услуги', creditAccount: 'Доставчици', explanation: 'Задължение към наемодателя' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи за наем', value: 1000 },
          { description: 'ДДС за възстановяване', value: 200 },
          { description: 'Задължения', value: 1200 }
        ]
      },
      {
        id: 8,
        title: 'Плащане на наема',
        description: 'Банково плащане на наема',
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
          { description: 'Банкова сметка', value: -1200 }
        ]
      },
      {
        id: 9,
        title: 'Фактура за интернет',
        description: 'Фактура за интернет услуги',
        document: {
          type: 'Фактура',
          number: '№305',
          counterparty: 'Нет Провайдър ООД',
          details: 'Интернет и телефон',
          amount: 150,
          vat: 30,
          total: 180,
        },
        correctEntry: [
          { debit: '602', credit: '4531', debitAccount: 'Разходи за външни услуги', creditAccount: 'ДДС покупки', explanation: 'Разходи за комуникации' },
          { debit: '602', credit: '401', debitAccount: 'Разходи за външни услуги', creditAccount: 'Доставчици', explanation: 'Задължение към доставчик' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 150 },
          { description: 'ДДС за възстановяване', value: 30 },
          { description: 'Задължения', value: 180 }
        ]
      },
      {
        id: 10,
        title: 'Плащане на интернет',
        description: 'Плащане на фактура за интернет',
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
          explanation: 'Заплащане на задължението'
        }],
        xpReward: 50,
        financialImpact: [
          { description: 'Задължения', value: -180 },
          { description: 'Банкова сметка', value: -180 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'СЕДМИЦА 2',
    subtitle: 'Покупки и продажби',
    story: 'Фирма Алфа Трейд ООД започва активна търговска дейност. Като счетоводител трябва да осчетоводиш покупки на стоки, продажби и плащания от клиенти.',
    locked: true,
    requiredLevel: 2,
    tasks: [
      {
        id: 1,
        title: 'Покупка на стоки',
        description: 'Покупка на търговски стоки от доставчик',
        document: {
          type: 'Фактура',
          number: '№105',
          counterparty: 'Бета ООД',
          details: 'Стоки за препродажба',
          amount: 3000,
          vat: 600,
          total: 3600,
          condition: 'покупка на кредит'
        },
        correctEntry: [
          { debit: '302', credit: '4531', debitAccount: 'Стоки', creditAccount: 'ДДС покупки', explanation: 'Стоките са актив, който ще препродаваме' },
          { debit: '302', credit: '401', debitAccount: 'Стоки', creditAccount: 'Доставчици', explanation: 'Дължим на доставчика с ДДС' }
        ],
        commonMistake: { account: '601', explanation: '601 е за материали (консумативи), а 302 е за стоки за препродажба' },
        xpReward: 100,
        financialImpact: [
          { description: 'Стоки (актив)', value: 3000 },
          { description: 'ДДС за възстановяване', value: 600 },
          { description: 'Задължения', value: 3600 }
        ]
      },
      {
        id: 2,
        title: 'Частично плащане',
        description: 'Частично плащане към доставчик',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №010',
          counterparty: 'Бета ООД',
          details: 'Частично плащане по фактура №105',
          amount: 2000,
          total: 2000,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Намаляваме задължението с платената сума'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Задължения', value: -2000 },
          { description: 'Банкова сметка', value: -2000 }
        ]
      },
      {
        id: 3,
        title: 'Изплащане на остатък',
        description: 'Плащане на остатъка към доставчика',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №011',
          counterparty: 'Бета ООД',
          details: 'Остатък от фактура №105',
          amount: 1600,
          total: 1600,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Заплащане на остатъка'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Задължения', value: -1600 },
          { description: 'Банкова сметка', value: -1600 }
        ]
      },
      {
        id: 4,
        title: 'Продажба на стоки',
        description: 'Продажба на стоки на клиент',
        document: {
          type: 'Фактура',
          number: '№210',
          counterparty: 'Гама ЕООД',
          details: 'Продажба на стоки',
          amount: 5000,
          vat: 1000,
          total: 6000,
        },
        correctEntry: [
          { debit: '411', credit: '703', debitAccount: 'Клиенти', creditAccount: 'Приходи от продажба на стоки', explanation: 'Клиентът ни дължи общо 6000 лв.' },
          { debit: '411', credit: '4532', debitAccount: 'Клиенти', creditAccount: 'ДДС продажби', explanation: 'ДДС за плащане' }
        ],
        xpReward: 100,
        financialImpact: [
          { description: 'Вземания от клиенти', value: 6000 },
          { description: 'Приходи от продажби', value: 5000 },
          { description: 'ДДС за плащане', value: 1000 }
        ]
      },
      {
        id: 5,
        title: 'Постъпление от клиент',
        description: 'Получено плащане от клиент по банка',
        document: {
          type: 'Банков документ',
          number: 'КВ №050',
          counterparty: 'Гама ЕООД',
          details: 'Плащане по фактура №210',
          amount: 6000,
          total: 6000,
        },
        correctEntry: [{
          debit: '503',
          credit: '411',
          debitAccount: 'Разплащателна сметка',
          creditAccount: 'Клиенти',
          explanation: 'Увеличаваме парите в банка и намаляваме вземането'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Банкова сметка', value: 6000 },
          { description: 'Вземания от клиенти', value: -6000 }
        ]
      },
      {
        id: 6,
        title: 'Продажба на услуга',
        description: 'Продажба на консултантска услуга',
        document: {
          type: 'Фактура',
          number: '№215',
          counterparty: 'Делта ООД',
          details: 'Консултация счетоводство',
          amount: 1000,
          vat: 200,
          total: 1200,
        },
        correctEntry: [
          { debit: '411', credit: '705', debitAccount: 'Клиенти', creditAccount: 'Приходи от услуги', explanation: 'Приход от услуги' },
          { debit: '411', credit: '4532', debitAccount: 'Клиенти', creditAccount: 'ДДС продажби', explanation: 'ДДС' }
        ],
        xpReward: 100,
        financialImpact: [
          { description: 'Вземания', value: 1200 },
          { description: 'Приходи от услуги', value: 1000 },
          { description: 'ДДС за плащане', value: 200 }
        ]
      },
      {
        id: 7,
        title: 'Касово плащане',
        description: 'Клиентът плаща в брой',
        document: {
          type: 'Касов ордер',
          number: 'КО №020',
          counterparty: 'Делта ООД',
          details: 'Плащане на фактура №215',
          amount: 1200,
          total: 1200,
        },
        correctEntry: [{
          debit: '501',
          credit: '411',
          debitAccount: 'Каса',
          creditAccount: 'Клиенти',
          explanation: 'Увеличаваме касата и намаляваме вземането'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Каса', value: 1200 },
          { description: 'Вземания', value: -1200 }
        ]
      },
      {
        id: 8,
        title: 'Транспортни разходи',
        description: 'Фактура за транспорт на стоки',
        document: {
          type: 'Фактура',
          number: '№400',
          counterparty: 'Спедитор ЕООД',
          details: 'Транспортни услуги',
          amount: 200,
          vat: 40,
          total: 240,
        },
        correctEntry: [
          { debit: '602', credit: '4531', debitAccount: 'Разходи за външни услуги', creditAccount: 'ДДС покупки', explanation: 'Транспортни разходи' },
          { debit: '602', credit: '401', debitAccount: 'Разходи за външни услуги', creditAccount: 'Доставчици', explanation: 'Задължение към спедитор' }
        ],
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 200 },
          { description: 'ДДС за възстановяване', value: 40 },
          { description: 'Задължения', value: 240 }
        ]
      },
      {
        id: 9,
        title: 'Плащане на транспорт',
        description: 'Плащане на транспортната услуга',
        document: {
          type: 'Платежно нареждане',
          number: 'ПН №015',
          counterparty: 'Спедитор ЕООД',
          details: 'Транспорт',
          amount: 240,
          total: 240,
        },
        correctEntry: [{
          debit: '401',
          credit: '503',
          debitAccount: 'Доставчици',
          creditAccount: 'Разплащателна сметка',
          explanation: 'Заплащане на транспорта'
        }],
        xpReward: 75,
        financialImpact: [
          { description: 'Задължения', value: -240 },
          { description: 'Банкова сметка', value: -240 }
        ]
      },
      {
        id: 10,
        title: 'Консумативи',
        description: 'Покупка на консумативи за офиса',
        document: {
          type: 'Фактура',
          number: '№500',
          counterparty: 'Канцелария ООД',
          details: 'Консумативи',
          amount: 400,
          vat: 80,
          total: 480,
        },
        correctEntry: [
          { debit: '601', credit: '4531', debitAccount: 'Разходи за материали', creditAccount: 'ДДС покупки', explanation: 'Разходи за консумативи' },
          { debit: '601', credit: '401', debitAccount: 'Разходи за материали', creditAccount: 'Доставчици', explanation: 'Задължение' }
        ],
        commonMistake: { account: '302', explanation: 'Консумативите са разход, не стоки за препродажба' },
        xpReward: 75,
        financialImpact: [
          { description: 'Разходи', value: 400 },
          { description: 'ДДС за възстановяване', value: 80 },
          { description: 'Задължения', value: 480 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'СЕДМИЦА 3',
    subtitle: 'Разширени операции',
    story: 'Предстои да научиш по-сложни счетоводни операции...',
    locked: true,
    requiredLevel: 5,
    tasks: []
  }
];

const ROLES = [
  { level: 1, title: 'Стажант счетоводител', xpNeeded: 0 },
  { level: 2, title: 'Младши счетоводител', xpNeeded: 500 },
  { level: 3, title: 'Практически счетоводител', xpNeeded: 1000 },
  { level: 4, title: 'Старши счетоводител', xpNeeded: 2000 }
];

export default function AccountifySimulator() {
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

  const currentWeekData = WEEKS[currentWeek];
  const currentTaskData = currentWeekData?.tasks[currentTask];
  const progress = currentWeekData ? ((currentTask) / currentWeekData.tasks.length) * 100 : 0;
  const currentRole = ROLES.find(r => r.level === playerLevel)?.title || ROLES[0].title;

  const calculateCompanyStats = () => {
    let assets = 20000; // Starting capital
    let liabilities = 0;
    
    // Calculate based on completed tasks
    completedTasks.forEach(taskId => {
      // Find task and apply financial impact
      WEEKS.forEach(week => {
        const task = week.tasks.find(t => t.id === taskId);
        if (task) {
          task.financialImpact.forEach(impact => {
            if (impact.description.includes('Задължения')) {
              liabilities += impact.value;
            } else if (impact.description.includes('Стоки') || impact.description.includes('ДМА') || impact.description.includes('Пари') || impact.description.includes('Каса') || impact.description.includes('Клиенти')) {
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
      setPlayerXP(prev => prev + currentTaskData.xpReward);
      setCompletedTasks(prev => [...prev, currentTaskData.id]);
      
      // Check for level up
      const nextRole = ROLES.find(r => r.level === playerLevel + 1);
      if (nextRole && playerXP + currentTaskData.xpReward >= nextRole.xpNeeded) {
        setPlayerLevel(prev => prev + 1);
      }
      
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
    if (WEEKS[weekIndex].locked) {
      setGameState('locked');
      return;
    }
    setCurrentWeek(weekIndex);
    setCurrentTask(0);
    setGameState('playing');
    resetTask();
  };

  const unlockWeek = (weekId: number) => {
    setWeeksUnlocked(prev => [...prev, weekId]);
    const weekIndex = WEEKS.findIndex(w => w.id === weekId);
    if (weekIndex !== -1) {
      WEEKS[weekIndex].locked = false;
    }
  };

  const getAccountName = (code: string) => {
    return ACCOUNTS.find(a => a.code === code)?.name || code;
  };

  const isCommonMistake = (debit: string, credit: string) => {
    return currentTaskData?.commonMistake && 
           (debit === currentTaskData.commonMistake.account || 
            credit === currentTaskData.commonMistake.account);
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ACCOUNTIFY
            </h1>
            <p className="text-xl text-gray-300">Симулатор по българско счетоводство</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="bg-white/10 px-6 py-3 rounded-full flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Ниво {playerLevel}</span>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-full flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>{playerXP} XP</span>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-full flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>{currentRole}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {WEEKS.map((week, index) => (
              <div 
                key={week.id}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                  week.locked 
                    ? 'border-gray-600 bg-gray-800/50 opacity-75' 
                    : weeksUnlocked.includes(week.id)
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-yellow-500 bg-yellow-900/20'
                } p-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      week.locked ? 'bg-gray-700' : 'bg-indigo-600'
                    }`}>
                      {week.locked ? (
                        <Lock className="w-8 h-8" />
                      ) : (
                        <BookOpen className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{week.title}</h2>
                      <p className="text-gray-400">{week.subtitle}</p>
                      {week.locked && week.requiredLevel && (
                        <p className="text-sm text-yellow-400 mt-1">
                          Изисква Ниво {week.requiredLevel}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {week.locked ? (
                    index === 1 ? (
                      <button 
                        onClick={() => unlockWeek(week.id)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                      >
                        <Unlock className="w-5 h-5" />
                        Отключи обучението
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-700 rounded-full text-gray-400">
                        Скоро
                      </span>
                    )
                  ) : (
                    <button 
                      onClick={() => startWeek(index)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-full font-bold transition-colors flex items-center gap-2"
                    >
                      {weeksUnlocked.includes(week.id) ? 'Продължи' : 'Започни'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {week.locked && index === 1 && (
                  <div className="mt-4 p-4 bg-yellow-900/30 rounded-lg border border-yellow-600/30">
                    <p className="text-sm text-yellow-200">
                      Ще научиш: покупка и продажба на стоки, работа с клиенти, ДДС операции
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'locked') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center text-white p-8">
        <div className="text-center max-w-md">
          <Lock className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">Заключено съдържание</h2>
          <p className="text-gray-300 mb-8">
            Трябва да завършиш предходните седмици и да достигнеш необходимото ниво, за да продължиш.
          </p>
          <button 
            onClick={() => setGameState('menu')}
            className="bg-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors"
          >
            Обратно към менюто
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-800 text-white p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-400" />
            <h2 className="text-4xl font-bold mb-2">Поздравления!</h2>
            <p className="text-xl text-gray-300">Завърши {currentWeekData.title}</p>
          </div>

          <div className="bg-black/20 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Финансово състояние на Алфа Трейд ООД
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Активи</p>
                <p className="text-2xl font-bold text-green-400">{companyStats.assets.toLocaleString()} лв</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Задължения</p>
                <p className="text-2xl font-bold text-red-400">{companyStats.liabilities.toLocaleString()} лв</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Капитал</p>
                <p className="text-2xl font-bold text-blue-400">{companyStats.capital.toLocaleString()} лв</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setGameState('menu')}
              className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-xl font-bold transition-colors"
            >
              Към менюто
            </button>
            {currentWeek < WEEKS.length - 1 && (
              <button 
                onClick={() => startWeek(currentWeek + 1)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                Седмица 2
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header Progress */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setGameState('menu')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Меню
              </button>
              <h1 className="font-bold text-lg">{currentWeekData.title} – {currentWeekData.subtitle}</h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Ниво {playerLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>{playerXP} XP</span>
              </div>
              <div className="px-3 py-1 bg-indigo-600/50 rounded-full text-xs">
                {currentRole}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-24">
              Задача {currentTask + 1} / {currentWeekData.tasks.length}
            </span>
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Story & Document */}
        <div className="lg:col-span-2 space-y-6">
          {/* Story Card */}
          {currentTask === 0 && (
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-600 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Алфа Трейд ООД</h3>
                  <p className="text-gray-300 leading-relaxed">{currentWeekData.story}</p>
                </div>
              </div>
            </div>
          )}

          {/* Document Display */}
          <div className="bg-white rounded-2xl text-gray-800 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-600" />
                <span className="font-bold text-gray-700">{currentTaskData.document.type}</span>
                <span className="text-gray-500">|</span>
                <span className="font-mono text-gray-600">{currentTaskData.document.number}</span>
              </div>
              <span className="text-sm text-gray-500">Дата: {new Date().toLocaleDateString('bg-BG')}</span>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Доставчик/Клиент:</p>
                  <p className="font-bold text-lg">{currentTaskData.document.counterparty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Сума:</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {currentTaskData.document.amount.toLocaleString()} лв.
                  </p>
                  {currentTaskData.document.vat && (
                    <p className="text-sm text-gray-600 mt-1">
                      + ДДС: {currentTaskData.document.vat} лв.
                    </p>
                  )}
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    Общо: {currentTaskData.document.total.toLocaleString()} лв.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Описание:</p>
                <p className="text-lg font-medium">{currentTaskData.document.details}</p>
                {currentTaskData.document.condition && (
                  <p className="mt-2 text-sm text-indigo-600 font-medium">
                    Условие: {currentTaskData.document.condition}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Task Description */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              {currentTaskData.title}
            </h3>
            <p className="text-gray-300 text-lg">{currentTaskData.description}</p>
          </div>

          {/* Feedback Section */}
          {showExplanation && (
            <div className={`rounded-2xl p-6 border-2 ${
              feedback === 'correct' 
                ? 'bg-green-900/30 border-green-500/50' 
                : 'bg-red-900/30 border-red-500/50'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  feedback === 'correct' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {feedback === 'correct' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-xl font-bold mb-2 ${
                    feedback === 'correct' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {feedback === 'correct' ? '✔ Правилно!' : '✘ Грешка'}
                  </h4>
                  
                  {feedback === 'correct' && (
                    <div className="mb-4">
                      <span className="inline-block bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                        +{currentTaskData.xpReward} XP
                      </span>
                    </div>
                  )}

                  {feedback === 'incorrect' && isCommonMistake(selectedDebit, selectedCredit) && (
                    <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4 mb-4">
                      <p className="text-yellow-200 text-sm font-medium">
                        ⚠ Това е честа грешка на стажант счетоводители.
                      </p>
                      <p className="text-yellow-100 mt-1">
                        {currentTaskData.commonMistake?.explanation}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="font-semibold text-white">Обяснение:</p>
                    {currentTaskData.correctEntry.map((entry, idx) => (
                      <p key={idx} className="text-gray-300">{entry.explanation}</p>
                    ))}
                  </div>

                  {feedback === 'correct' && (
                    <div className="mt-6 bg-black/20 rounded-xl p-4">
                      <p className="font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Ефект върху фирмата:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {currentTaskData.financialImpact.map((impact, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">{impact.description}:</span>
                            <span className={impact.value > 0 ? 'text-green-400' : 'text-red-400'}>
                              {impact.value > 0 ? '+' : ''}{impact.value.toLocaleString()} лв
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={feedback === 'correct' ? handleNextTask : () => {
                      resetTask();
                    }}
                    className={`mt-6 px-6 py-3 rounded-xl font-bold transition-colors ${
                      feedback === 'correct'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {feedback === 'correct' ? 'Продължи →' : 'Опитай отново'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Journal Entry */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Счетоводна статия
            </h3>

            <div className="space-y-6">
              {/* Debit Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Дебит (Дт)
                </label>
                <select 
                  value={selectedDebit}
                  onChange={(e) => setSelectedDebit(e.target.value)}
                  disabled={showExplanation}
                  className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Избери сметка...</option>
                  {ACCOUNTS.map(account => (
                    <option key={account.code} value={account.code}>
                      {account.code} {account.name}
                    </option>
                  ))}
                </select>
                {selectedDebit && (
                  <p className="mt-2 text-sm text-indigo-400">
                    {getAccountName(selectedDebit)}
                  </p>
                )}
              </div>

              {/* Credit Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Кредит (Кт)
                </label>
                <select 
                  value={selectedCredit}
                  onChange={(e) => setSelectedCredit(e.target.value)}
                  disabled={showExplanation}
                  className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Избери сметка...</option>
                  {ACCOUNTS.map(account => (
                    <option key={account.code} value={account.code}>
                      {account.code} {account.name}
                    </option>
                  ))}
                </select>
                {selectedCredit && (
                  <p className="mt-2 text-sm text-indigo-400">
                    {getAccountName(selectedCredit)}
                  </p>
                )}
              </div>

              {/* Amount Display */}
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Сума:</p>
                <p className="text-2xl font-bold text-white">
                  {currentTaskData.document.total.toLocaleString()} лв.
                </p>
              </div>

              <button 
                onClick={handleCheckAnswer}
                disabled={!selectedDebit || !selectedCredit || showExplanation}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Провери отговора
              </button>

              {/* Mini Hint */}
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
                <p className="text-xs text-yellow-200/80 leading-relaxed">
                  <strong className="text-yellow-400">Подсказка:</strong> Запомни: Активите се увеличават по дебит (Дт), а капиталът и задълженията - по кредит (Кт).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}