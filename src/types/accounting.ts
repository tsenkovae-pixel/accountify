export type Level = "intern" | "junior" | "senior" | "chief";
export type Mode = "story" | "practice" | "exam";
export type Category =
  | "capital"
  | "cash"
  | "suppliers"
  | "customers"
  | "expenses"
  | "assets"
  | "vat"
  | "eu"
  | "third-country"
  | "payroll"
  | "loans"
  | "closing";

export type Currency = "BGN" | "EUR";

export type CorrectEntry = {
  debit: string | string[];
  credit: string | string[];
};

export type Exercise = {
  id: string;
  title: string;
  level: Level;
  week: 1 | 2 | 3 | 4;
  order: number;
  mode: Mode;
  category: Category;
  documentType: string;
  counterparty?: string;
  currency: Currency;
  amount: number; // Сума без ДДС (основна)
  vatAmount?: number; // Сума на ДДС-а
  totalAmount?: number; // Обща сума (с ДДС)
  vatRate?: number; // 20 или 0
  scenario: string;
  hint: string;
  possibleAccounts: string[];
  correctEntry: CorrectEntry;
  explanation?: string;
};