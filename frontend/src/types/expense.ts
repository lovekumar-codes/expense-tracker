export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}