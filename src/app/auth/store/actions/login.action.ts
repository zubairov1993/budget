import { createAction, props } from "@ngrx/store"
import { ActionTypes } from '../action-types'

import { UserI, FBResponseI } from '../../interfaces/auth.interface'
import { BackendErrorsI } from '../../../shared/interfaces/backend-errors.interface'

export const loginAction = createAction(
  ActionTypes.LOGIN,
  props<{ request: UserI }>()
)

export const loginSuccessAction = createAction(
  ActionTypes.LOGIN_SUCCESS,
  props<{ response: FBResponseI }>()
)

export const loginFailureAction = createAction(
  ActionTypes.LOGIN_FAILURE,
  props<{ errors: BackendErrorsI }>()
)
