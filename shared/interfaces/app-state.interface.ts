import { AuthStateI } from '../../auth/interfaces/auth.interface'
import { BudgetStateI } from './budget.interface'

export interface AppStateI {
  auth: AuthStateI
  budget: BudgetStateI
}
