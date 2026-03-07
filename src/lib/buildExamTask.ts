import type { AccountingTemplate } from "./accountingTemplates";
import type { ExamVariables } from "./generateExamVariables";

export type ExamTask = {
  id: string;
  scenario: string;
  document: {
    type: string;
    number: string;
    date: string;
    amount: number;
  };
  correctEntry: {
    debit: { account: string; amount: number }[];
    credit: { account: string; amount: number }[];
  };
};

export function buildExamTask(template: AccountingTemplate, variables: ExamVariables): ExamTask {
  return {
    id: template.id,
    scenario: template.textTemplate.replace("{amount}", variables.amount.toLocaleString()),
    document: {
      type: template.documentType,
      number: variables.documentNumber,
      date: variables.date,
      amount: variables.amount
    },
    correctEntry: {
      debit: template.debit.map(d => ({ account: d.account, amount: variables.amount })),
      credit: template.credit.map(c => ({ account: c.account, amount: variables.amount }))
    }
  };
}