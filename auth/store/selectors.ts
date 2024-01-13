import { createFeatureSelector, createSelector } from "@ngrx/store"

import { AuthStateI } from '../interfaces/auth.interface'
import { AppStateI } from "src/app/shared"

export const authFeatureSelector = createFeatureSelector<AppStateI, AuthStateI>('auth')
export const isSubmittingSelector = createSelector(authFeatureSelector, (authState: AuthStateI) => authState.isSubmitting)
