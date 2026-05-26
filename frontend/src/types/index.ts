export interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Budget {
  budget: number;
  spent: number;
  remaining: number;
  warning?: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface ExpenseResponse {
  data: Expense[];
}

export interface StatsResponse {
  today: number;
  month: number;
  year: number;
  recent: Expense[];
}
