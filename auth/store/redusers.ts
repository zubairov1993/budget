import { createReducer, on, Action } from "@ngrx/store"
import { AuthStateI } from "../interfaces/auth.interface"
import { loginAction } from './actions/login.action'

const initialState: AuthStateI = {
  isSubmitting: false
}

const authReducer = createReducer(
  initialState,
  on(loginAction, (state): AuthStateI => ({
    ...state,
    isSubmitting: true
  }) )
)

export function reducers(state: AuthStateI, action: Action) {
  return authReducer(state, action)
}
