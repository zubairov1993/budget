import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'

import { DeleteItemActionI } from '../../interfaces/item-action.interface'

export const deleteItem = createAction(
  ActionTypes.DELETE_ITEM,
  props<DeleteItemActionI>()
)

export const deleteItemSuccessAction = createAction(
  ActionTypes.DELETE_ITEM_SUCCESS,
  props<DeleteItemActionI>()
)

export const deleteItemFailureAction = createAction(ActionTypes.DELETE_ITEM_FAILURE)
