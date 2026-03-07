import { NextRequest, NextResponse } from 'next/server';

// Временна функция за тестване - чете реални данни от задачата!
function mockTutorResponse(mode: string, attemptNumber: number, evaluation: any, payload: any) {
  // Намираме правилните сметки от expectedEntry (която е масив от обекти с side, accountCode, accountName)
  const expectedEntries = payload?.task?.expectedEntry || [];
  
  // Намираме дебит и кредит по side полето
  const debitEntry = expectedEntries.find((e: any) => e.side === 'debit') || expectedEntries[0] || {};
  const creditEntry = expectedEntries.find((e: any) => e.side === 'credit') || expectedEntries[1] || {};
  
  const debitCode = debitEntry.accountCode || '503';
  const creditCode = creditEntry.accountCode || '101';
  const debitName = debitEntry.accountName || `Сметка ${debitCode}`;
  const creditName = creditEntry.accountName || `Сметка ${creditCode}`;
  
  // Имена на сметки (разширен мап)
  const accountNames: Record<string, string> = {
    '101': 'Основен капитал',
    '111': 'Печалби от предходни години',
    '112': 'Печалба на текущата година',
    '501': 'Каса',
    '503': 'Разплащателна сметка',
    '504': 'Валутна сметка',
    '302': 'Стоки',
    '303': 'Продукти',
    '304': 'Суровини и материали',
    '204': 'Компютри и оборудване',
    '205': 'Машини и съоръжения',
    '206': 'Превозни средства',
    '401': 'Доставчици',
    '411': 'Клиенти',
    '412': 'Вземания от клиенти',
    '454': 'Задължения към персонала',
    '455': 'Задължения към осигурителни институти',
    '456': 'Задължения към бюджета за данъци',
    '601': 'Разходи за материали',
    '602': 'Разходи за външни услуги',
    '604': 'Разходи за заплати',
    '605': 'Разходи за осигуровки',
    '621': 'Разходи за амортизация',
    '691': 'Разходи за лихви',
    '701': 'Приходи от продажби',
    '703': 'Приходи от продажба на стоки',
    '705': 'Приходи от услуги',
    '4531': 'ДДС покупки',
    '4532': 'ДДС продажби'
  };

  const finalDebitName = accountNames[debitCode] || debitName;
  const finalCreditName = accountNames[creditCode] || creditName;

  // Ако е верно
  if (evaluation?.correct) {
    return {
      success: true,
      mode,
      hint: `✅ **Вярна операция!**\n\n**Дебит:** ${debitCode} ${finalDebitName}\n**Кредит:** ${creditCode} ${finalCreditName}\n\nОтлична работа! Проводката отразява икономическата същност на операцията.`,
      attemptNumber,
      evaluation
    };
  }

  // Ако е грешно - различни нива на помощ
  if (mode === 'strict' || attemptNumber === 1) {
    return {
      success: true,
      mode,
      hint: `❌ **Грешка в операцията**\n\nПомисли отново: Коя сметка се **увеличава** (дебит) и коя се **намалява** (кредит) при тази операция?\n\n💡 *Съвет: Всяка операция има поне две страни - даване и получаване.*`,
      attemptNumber,
      evaluation
    };
  }

  if (attemptNumber === 2) {
    return {
      success: true,
      mode,
      hint: `❌ **Втора грешка**\n\nОперацията изисква:\n- **Дебит:** ${finalDebitName} (${debitCode}) - получаване/увеличаване на актив/разход\n- **Кредит:** ${finalCreditName} (${creditCode}) - даване/намаляване на пасив/капитал\n\nПровери дали не си разменил дебита и кредита!`,
      attemptNumber,
      evaluation
    };
  }

  // Трета опция или revealing mode - показваме реалните сметки от задачата!
  return {
    success: true,
    mode: 'revealing',
    hint: `📚 **Решение:**\n\n**Дебит:** ${debitCode} ${finalDebitName}\n**Кредит:** ${creditCode} ${finalCreditName}\n\n${getExplanation(debitCode, creditCode)}`,
    attemptNumber,
    evaluation: { ...evaluation, correct: true, revealed: true }
  };
}

// Помощна функция за обяснения според типа операция
function getExplanation(debitCode: string, creditCode: string): string {
  if (debitCode === '503' && creditCode === '101') {
    return 'При внасяне на пари в банковата сметка, увеличаваме разплащателната сметка (дебит) и увеличаваме основния капитал (кредит).';
  }
  if (debitCode === '501' && creditCode === '503') {
    return 'При теглене от банка, увеличаваме касата (дебит) и намаляваме банковата сметка (кредит).';
  }
  if (debitCode === '601' && creditCode === '401') {
    return 'При покупка на материали на кредит, увеличаваме разходите (дебит) и увеличаваме задълженията към доставчици (кредит).';
  }
  if (debitCode === '302' && creditCode === '401') {
    return 'При покупка на стоки на кредит, увеличаваме стоките (дебит) и увеличаваме задълженията (кредит).';
  }
  if (debitCode === '411' && (creditCode === '703' || creditCode === '705')) {
    return 'При продажба на кредит, увеличаваме вземанията от клиенти (дебит) и увеличаваме приходите (кредит).';
  }
  if (debitCode === '503' && creditCode === '411') {
    return 'При постъпление от клиент, увеличаваме банковата сметка (дебит) и намаляваме вземанията (кредит).';
  }
  if (creditCode === '503' || creditCode === '501') {
    return 'При плащане, намаляваме задълженията (дебит) и намаляваме парите (кредит).';
  }
  return 'При тази операция се увеличава активът/разходът (дебит) и съответно се намалява друг актив или се увеличава задължение/капитал (кредит).';
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, attemptNumber, evaluation, task, userEntry } = body;

    // Проверка на payload-a
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Липсва evaluation' },
        { status: 400 }
      );
    }

    // Използваме mock функцията (засега без OpenAI)
    const response = mockTutorResponse(
      mode || 'normal',
      attemptNumber || 1,
      evaluation,
      { task, userEntry }
    );

    return NextResponse.json(response);

  } catch (error) {
    console.error('Tutor API Error:', error);
    return NextResponse.json(
      { error: 'Вътрешна грешка в сървъра', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}