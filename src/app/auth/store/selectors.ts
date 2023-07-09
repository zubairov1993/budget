import { createFeatureSelector, createSelector } from "@ngrx/store"

import { AppStateI } from '../../shared/interfaces/app-state.interface'
import { AuthStateI } from '../interfaces/auth.interface'

export const authFeatureSelector = createFeatureSelector<AppStateI, AuthStateI>('auth')
export const isSubmittingSelector = createSelector(authFeatureSelector, (authState: AuthStateI) => authState.isSubmitting)
