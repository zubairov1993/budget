import { AuthStateI } from '../../auth/interfaces/auth.interface'
import { BudgetStateI, YearDataI, MonthDataI, DayDataI, ItemDataI } from './budget.interface';

export interface AppStateI {
  auth: AuthStateI
  budget: BudgetStateI
  year: YearDataI
  month: MonthDataI
  day: DayDataI
  item: ItemDataI
}
