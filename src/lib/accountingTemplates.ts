export type ExamLevel = "intern" | "junior" | "senior" | "chief";

export type AccountingTemplate = {
  id: string;
  level: ExamLevel;
  documentType: "invoice" | "receipt" | "bank_transfer" | "payroll";
  description: string;
  debit: { account: string }[];
  credit: { account: string }[];
  textTemplate: string;
};

export const accountingTemplates: AccountingTemplate[] = [
  {
    id: "capital_cash",
    level: "intern",
    documentType: "receipt",
    description: "Внасяне на капитал в брой",
    debit: [{ account: "501" }],
    credit: [{ account: "101" }],
    textTemplate: "Собственикът внася {amount} лв. в брой като основен капитал."
  },
  {
    id: "purchase_cash",
    level: "intern",
    documentType: "receipt",
    description: "Покупка на материали в брой",
    debit: [{ account: "601" }],
    credit: [{ account: "501" }],
    textTemplate: "Закупени са материали за {amount} лв., платени в брой от касата."
  },
  {
    id: "sale_deferred",
    level: "intern",
    documentType: "invoice",
    description: "Продажба с отложено плащане",
    debit: [{ account: "411" }],
    credit: [{ account: "702" }],
    textTemplate: "Издадена е фактура за продажба на стоки за {amount} лв. с отложено плащане."
  },
  {
    id: "pay_supplier",
    level: "intern",
    documentType: "bank_transfer",
    description: "Плащане към доставчик",
    debit: [{ account: "401" }],
    credit: [{ account: "503" }],
    textTemplate: "Извършено е банково плащане от {amount} лв. към доставчик."
  },
  {
    id: "receive_payment",
    level: "intern",
    documentType: "bank_transfer",
    description: "Постъпление от клиент",
    debit: [{ account: "503" }],
    credit: [{ account: "411" }],
    textTemplate: "Клиент превежда {amount} лв. по банковата сметка на фирмата."
  },
  {
    id: "sale_cash",
    level: "intern",
    documentType: "receipt",
    description: "Продажба в брой",
    debit: [{ account: "501" }],
    credit: [{ account: "702" }],
    textTemplate: "Извършена е продажба в брой на стоки за {amount} лв."
  },
  {
    id: "capital_bank",
    level: "intern",
    documentType: "bank_transfer",
    description: "Внасяне на капитал по банка",
    debit: [{ account: "503" }],
    credit: [{ account: "101" }],
    textTemplate: "Собственикът внася {amount} лв. по банкова сметка като капитал."
  },
  {
    id: "purchase_supplier",
    level: "intern",
    documentType: "invoice",
    description: "Покупка с отложено плащане",
    debit: [{ account: "601" }],
    credit: [{ account: "401" }],
    textTemplate: "Получена е фактура за материали на стойност {amount} лв. с отложено плащане."
  },
  {
    id: "buy_computer",
    level: "junior",
    documentType: "invoice",
    description: "Закупуване на компютър (ДМА)",
    debit: [{ account: "203" }],
    credit: [{ account: "503" }],
    textTemplate: "Закупен е компютър за нуждите на фирмата за {amount} лв., платен по банка."
  },
  {
    id: "buy_furniture",
    level: "junior",
    documentType: "invoice",
    description: "Офис обзавеждане",
    debit: [{ account: "207" }],
    credit: [{ account: "503" }],
    textTemplate: "Закупено е офис обзавеждане за {amount} лв., платено по банков път."
  },
  {
    id: "salary_accrual",
    level: "junior",
    documentType: "payroll",
    description: "Начисляване на заплати",
    debit: [{ account: "604" }],
    credit: [{ account: "421" }],
    textTemplate: "Начислени са заплати на персонала за месеца в размер на {amount} лв."
  },
  {
    id: "salary_payment",
    level: "junior",
    documentType: "bank_transfer",
    description: "Изплащане на заплати",
    debit: [{ account: "421" }],
    credit: [{ account: "503" }],
    textTemplate: "Изплатени са заплати на персонала по банков път в размер на {amount} лв."
  },
  {
    id: "bank_to_cash",
    level: "junior",
    documentType: "bank_transfer",
    description: "Теглене на пари от банка",
    debit: [{ account: "501" }],
    credit: [{ account: "503" }],
    textTemplate: "Изтеглени са {amount} лв. от банковата сметка за касата."
  },
  {
    id: "cash_to_bank",
    level: "junior",
    documentType: "receipt",
    description: "Внасяне на пари в банка",
    debit: [{ account: "503" }],
    credit: [{ account: "501" }],
    textTemplate: "Внесени са {amount} лв. от касата в банковата сметка."
  },
  {
    id: "receive_invoice",
    level: "intern",
    documentType: "invoice",
    description: "Получаване на фактура за наем",
    debit: [{ account: "611" }],
    credit: [{ account: "401" }],
    textTemplate: "Получена е фактура за наем на офис за {amount} лв. с отложено плащане."
  }
];

export function pickRandomTemplates(level: ExamLevel, count: number) {
  const eligible = accountingTemplates.filter(t => t.level === level);
  return [...eligible].sort(() => Math.random() - 0.5).slice(0, count);
}