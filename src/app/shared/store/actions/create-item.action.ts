import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'
import { CreateItemActionI, CreateItemSuccessAction } from '../../interfaces'


export const createItemAction = createAction(
  ActionTypes.CREATE_ITEM,
  props<CreateItemActionI>()
)

export const createItemSuccessAction = createAction(
  ActionTypes.CREATE_ITEM_SUCCESS,
  props<CreateItemSuccessAction>()
)

export const createItemFailureAction = createAction(ActionTypes.CREATE_ITEM_FAILURE)
