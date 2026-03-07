export type ExamVariables = {
  amount: number;
  date: string;
  documentNumber: string;
  counterparty: string;
};

export function generateExamVariables(): ExamVariables {
  return {
    amount: Math.floor(Math.random() * 9000) + 1000,
    date: new Date().toLocaleDateString('bg-BG'),
    documentNumber: `DOC-${Math.floor(Math.random() * 10000)}`,
    counterparty: "Клиент/Доставчик"
  };
}