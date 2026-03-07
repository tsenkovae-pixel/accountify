export type IssueCode = 
  | 'WRONG_ACCOUNT_TYPE' 
  | 'MISSING_VAT' 
  | 'WRONG_SIDE' 
  | 'BALANCE_ERROR'
  | 'WRONG_VAT_ACCOUNT'
  | 'MISSING_ENTRY'
  | 'CORRECT';

export interface EvaluationIssue {
  code: IssueCode;
  details: string;
  severity: 'error' | 'warning' | 'info';
}

export interface StudentEntry {
  side: 'debit' | 'credit';
  accountCode: string;
  amount: number;
}

export interface ExpectedEntry {
  side: 'debit' | 'credit';
  accountCode: string;
  amount: number;
  accountName: string;
}

export function evaluateEntry(
  studentEntries: StudentEntry[],
  expectedEntries: ExpectedEntry[],
  hasVat: boolean
): {
  isCorrect: boolean;
  isBalanced: boolean;
  issues: EvaluationIssue[];
} {
  const issues: EvaluationIssue[] = [];
  
  // 1. Проверка за баланс
  const totalDebit = studentEntries
    .filter(e => e.side === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredit = studentEntries
    .filter(e => e.side === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const isBalanced = totalDebit === totalCredit;
  
  if (!isBalanced) {
    issues.push({
      code: 'BALANCE_ERROR',
      details: `Дебит (${totalDebit}) ≠ Кредит (${totalCredit}). Проводката трябва да балансира.`,
      severity: 'error'
    });
  }
  
  // 2. Проверка за липсващ ДДС (ако документът има ДДС)
  if (hasVat) {
    const hasVatEntry = studentEntries.some(e => 
      e.accountCode === '4531' || e.accountCode === '4532'
    );
    if (!hasVatEntry) {
      issues.push({
        code: 'MISSING_VAT',
        details: 'Липсва ред за ДДС. Провери дали документът включва ДДС.',
        severity: 'error'
      });
    }
  }
  
  // 3. Сравнение с expectedEntry
  let correctCount = 0;
  
  expectedEntries.forEach(expected => {
    const match = studentEntries.find(student => 
      student.accountCode === expected.accountCode &&
      student.side === expected.side &&
      student.amount === expected.amount
    );
    
    if (!match) {
      // Проверка дали сметката съществува но е на грешна страна
      const wrongSide = studentEntries.find(s => 
        s.accountCode === expected.accountCode && s.side !== expected.side
      );
      
      if (wrongSide) {
        issues.push({
          code: 'WRONG_SIDE',
          details: `Сметка ${expected.accountCode} е избрана, но на грешна страна (${wrongSide.side} вместо ${expected.side}).`,
          severity: 'error'
        });
      } else {
        // Проверка за грешен тип сметка (напр. 601 вместо 302)
        const wrongAccount = studentEntries.find(s => 
          s.side === expected.side && 
          s.amount === expected.amount &&
          s.accountCode !== expected.accountCode
        );
        
        if (wrongAccount) {
          issues.push({
            code: 'WRONG_ACCOUNT_TYPE',
            details: `Използвана е сметка ${wrongAccount.accountCode} вместо ${expected.accountCode}.`,
            severity: 'error'
          });
        }
      }
    } else {
      correctCount++;
    }
  });
  
  // 4. Проверка за грешно ДДС (4531 vs 4532)
  const hasPurchaseVAT = expectedEntries.some(e => e.accountCode === '4531');
  const hasSalesVAT = expectedEntries.some(e => e.accountCode === '4532');
  
  if (hasPurchaseVAT && studentEntries.some(e => e.accountCode === '4532')) {
    issues.push({
      code: 'WRONG_VAT_ACCOUNT',
      details: 'Използван е ДДС продажби (4532) вместо ДДС покупки (4531).',
      severity: 'error'
    });
  }
  
  if (hasSalesVAT && studentEntries.some(e => e.accountCode === '4531')) {
    issues.push({
      code: 'WRONG_VAT_ACCOUNT',
      details: 'Използван е ДДС покупки (4531) вместо ДДС продажби (4532).',
      severity: 'error'
    });
  }
  
  const isCorrect = issues.length === 0 && correctCount === expectedEntries.length;
  
  return {
    isCorrect,
    isBalanced,
    issues
  };
}