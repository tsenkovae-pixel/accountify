import { NextResponse } from "next/server";

// ВСИЧКИ ДАННИ В ЕДИН ФАЙЛ
type ExamLevel = "intern" | "junior" | "senior" | "chief";

type AccountingTemplate = {
  id: string;
  level: ExamLevel;
  documentType: "invoice" | "receipt" | "bank_transfer" | "payroll";
  description: string;
  debit: { account: string }[];
  credit: { account: string }[];
  textTemplate: string;
};

const accountingTemplates: AccountingTemplate[] = [
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
  }
];

type ExamVariables = {
  amount: number;
  company: string;
  counterparty: string;
  date: string;
};

type ExamTask = {
  id: string;
  scenario: string;
  description: string;
  document: {
    type: string;
    number: string;
    date: string;
    company: string;
    counterparty: string;
    amount: number;
    currency: "BGN";
  };
  correctEntry: {
    debit: { account: string; amount: number }[];
    credit: { account: string; amount: number }[];
  };
};

function pickRandomTemplates(level: ExamLevel, count: number) {
  const eligible = accountingTemplates.filter(t => t.level === level);
  return [...eligible].sort(() => Math.random() - 0.5).slice(0, count);
}

function generateExamVariables(): ExamVariables {
  // Засега без AI, за да работи сигурно
  return {
    amount: Math.floor(Math.random() * 9000) + 1000,
    company: "Алфа Трейд ООД",
    counterparty: "Бета Комерс ЕООД",
    date: new Date().toISOString().split('T')[0]
  };
}

function buildExamTask(template: AccountingTemplate, vars: ExamVariables): ExamTask {
  const scenario = template.textTemplate.replace("{amount}", String(vars.amount));
  const prefixes: Record<string, string> = {
    invoice: "ФАК",
    receipt: "КВИ",
    bank_transfer: "БАН",
    payroll: "ЗАП"
  };
  const docNumber = `${prefixes[template.documentType]}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    scenario,
    description: template.description,
    document: {
      type: template.documentType,
      number: docNumber,
      date: vars.date,
      company: vars.company,
      counterparty: vars.counterparty,
      amount: vars.amount,
      currency: "BGN"
    },
    correctEntry: {
      debit: template.debit.map(d => ({ account: d.account, amount: vars.amount })),
      credit: template.credit.map(c => ({ account: c.account, amount: vars.amount }))
    }
  };
}

function validateVariables(vars: ExamVariables): boolean {
  return vars.amount >= 100 && vars.amount <= 20000;
}

function validateTask(task: ExamTask): boolean {
  const totalDebit = task.correctEntry.debit.reduce((sum, d) => sum + d.amount, 0);
  const totalCredit = task.correctEntry.credit.reduce((sum, c) => sum + c.amount, 0);
  return totalDebit === totalCredit;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const level = (body.level ?? "intern") as ExamLevel;
    const templates = pickRandomTemplates(level, 5);
    const tasks: ExamTask[] = [];

    for (const template of templates) {
      let attempts = 0;
      let task: ExamTask | null = null;
      
      while (!task && attempts < 3) {
        attempts++;
        const vars = generateExamVariables();
        if (!validateVariables(vars)) continue;
        const built = buildExamTask(template, vars);
        if (!validateTask(built)) continue;
        task = built;
      }
      
      if (task) tasks.push(task);
    }

    return NextResponse.json({
      examId: `exam-${Date.now()}`,
      level,
      tasks,
      passingScore: 70
    });
    
  } catch (error) {
    console.error("Грешка:", error);
    return NextResponse.json(
      { error: "Неуспешно генериране" },
      { status: 500 }
    );
  }
}