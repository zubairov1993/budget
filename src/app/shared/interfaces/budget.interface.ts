export interface BudgetStateI {
  isLoading: boolean;
  error: string | null;
  data: YearDataI[] | null;
}

export interface YearDataI {
  id: string;
  year: number;
  totalPriceYear: number | null;
  monthlyBudget?: number | null;
  months: MonthDataI[];
}

export interface MonthDataI {
  id: string;
  month: number;
  totalPriceMonth: number | null;
  days: DayDataI[];
}

export interface DayDataI {
  id: string;
  day: number;
  date: string;
  totalPriceDay: number | null;
  items: ItemDataI[];
}

export interface ItemDataI {
  id: string;
  name: string;
  category: string;
  priceRu: number;
}

export interface FilteredItemI {
  id: string;
  name: string;
  category: string;
  priceRu: number;
  date: string;
}

export interface YearEntity {
  months: { [key: string]: MonthEntity };
  year: number;
}

export interface MonthEntity {
  days: { [key: string]: DayEntity };
  month: number;
}

export interface DayEntity {
  date: string;
  day: number;
  items: { [key: string]: ItemEntity };
}

export interface ItemEntity {
  category: string;
  name: string;
  priceRu: number;
}
