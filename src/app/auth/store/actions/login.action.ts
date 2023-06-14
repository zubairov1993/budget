import { createAction, props } from "@ngrx/store"
import { ActionTypes } from '../action-types'

import { UserI } from '../../interfaces/auth.interface'

export const loginAction = createAction(
  ActionTypes.LOGIN,
  props<UserI>()
)
