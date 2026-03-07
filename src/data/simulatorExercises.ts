export interface Exercise {
  id: string;
  title: string;
  description: string;
  level: number;
  xpReward: number;
  scenario: string;
  document: {
    type: 'invoice' | 'bank' | 'receipt';
    number: string;
    date: string;
    supplier?: string;
    amount: number;
    vatAmount?: number;
    description: string;
  };
  correctAnswer: {
    debitAccount: string;
    creditAccount: string;
    amount: number;
    explanation: string;
  };
  hints: string[];
}

export const simulatorExercises: Exercise[] = [
  // НИВО 1: Стажант - Основни операции
  {
    id: 'sim-001',
    title: 'Покупка на стоки с ДДС',
    description: 'Осчетоводете фактура за покупка на стоки за продажба',
    level: 1,
    xpReward: 50,
    scenario: 'Фирма "Техно ООД" закупува стоки за продажба.',
    document: {
      type: 'invoice',
      number: '00001234',
      date: '2026-01-15',
      supplier: 'Поставчик ООД',
      amount: 1000,
      vatAmount: 200,
      description: 'Покупка на компютри за продажба'
    },
    correctAnswer: {
      debitAccount: '304',
      creditAccount: '401',
      amount: 1000,
      explanation: '304 (Стоки) се дебитира, защото увеличаваме актива. 401 (Доставчици) се кредитира, защото имаме задължение.'
    },
    hints: [
      'Стоките за продажба се отчитат в сметка 304',
      'Когато купуваме на кредит, задължението е към доставчик (сметка 401)',
      'ДДС-то се осчетоводява отделно в сметка 453'
    ]
  },
  {
    id: 'sim-002',
    title: 'Плащане на наем',
    description: 'Осчетоводете разход за офис наем',
    level: 1,
    xpReward: 40,
    scenario: 'Фирмата плаща наем за офиса в брой.',
    document: {
      type: 'receipt',
      number: '0001',
      date: '2026-01-20',
      amount: 500,
      description: 'Наем за януари 2026'
    },
    correctAnswer: {
      debitAccount: '602',
      creditAccount: '501',
      amount: 500,
      explanation: '602 (Разходи за наеми) се дебитира. 501 (Каса) се кредитира, защото плащаме в брой.'
    },
    hints: [
      'Наемът е разход за фирмата - сметка 602',
      'Плащането в брой намалява касата - сметка 501'
    ]
  },
  {
    id: 'sim-003',
    title: 'Продажба на стоки',
    description: 'Осчетоводете продажба на клиент',
    level: 1,
    xpReward: 60,
    scenario: 'Продавате стоки на клиент с фактура.',
    document: {
      type: 'invoice',
      number: '0000100',
      date: '2026-01-25',
      supplier: 'Клиент ООД',
      amount: 2000,
      vatAmount: 400,
      description: 'Продажба на компютри'
    },
    correctAnswer: {
      debitAccount: '411',
      creditAccount: '701',
      amount: 2000,
      explanation: '411 (Клиенти) се дебитира - имате вземане. 701 (Приходи от продажби) се кредитира.'
    },
    hints: [
      'Когато продаваме, създаваме вземане от клиент - сметка 411',
      'Приходите се отчитат в сметка 701'
    ]
  },

  // НИВО 2: Млад счетоводител - ДДС и банка
  {
    id: 'sim-004',
    title: 'ДДС върху покупка',
    description: 'Осчетоводете ДДС при внос на стоки',
    level: 2,
    xpReward: 80,
    scenario: 'Внасяте стоки от Германия. ДДС се начислява при вноса.',
    document: {
      type: 'invoice',
      number: 'DE123456',
      date: '2026-02-10',
      supplier: 'German Supplier GmbH',
      amount: 5000,
      vatAmount: 1000,
      description: 'Внос на машини от Германия'
    },
    correctAnswer: {
      debitAccount: '453',
      creditAccount: '453',
      amount: 1000,
      explanation: 'При внос ДДС се начислява и веднага се приспада. 4532 (ДДС за внос) се дебитира, 4531 (ДДС за покупки) се кредитира.'
    },
    hints: [
      'При внос ДДС е едновременно разход и данъчен кредит',
      'Използвате сметка 4532 за ДДС при внос'
    ]
  },
  {
    id: 'sim-005',
    title: 'Банков превод към доставчик',
    description: 'Осчетоводете плащане по банков път',
    level: 2,
    xpReward: 70,
    scenario: 'Плащате на доставчик по банков път.',
    document: {
      type: 'bank',
      number: 'ПП-2026-001',
      date: '2026-02-15',
      supplier: 'Поставчик ООД',
      amount: 1200,
      description: 'Плащане по фактура 00001234'
    },
    correctAnswer: {
      debitAccount: '401',
      creditAccount: '503',
      amount: 1200,
      explanation: '401 (Доставчици) се дебитира - намаляваме задължението. 503 (Банкова сметка) се кредитира.'
    },
    hints: [
      'Плащането намалява задължението към доставчика',
      'Банковата сметка се кредитира при плащане'
    ]
  }
];

// Филтриране по ниво
export const getExercisesByLevel = (level: number): Exercise[] => {
  return simulatorExercises.filter(ex => ex.level === level);
};

// Вземане на следващо упражнение за потребителя
export const getNextExercise = (level: number, completedIds: string[]): Exercise | null => {
  const available = simulatorExercises.filter(
    ex => ex.level === level && !completedIds.includes(ex.id)
  );
  return available.length > 0 ? available[0] : null;
};