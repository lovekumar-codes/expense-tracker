 import type  { Expense } from "./expense";

export interface StatsResponse {
  today: number;
  month: number;
  year: number;
  recent: Expense[];
}