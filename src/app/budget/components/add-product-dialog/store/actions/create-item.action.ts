import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '../action-types';
import { ItemDataI } from '../../../../../shared/interfaces/budget.interface';

export const createItemAction = createAction(
  ActionTypes.CREATE_ITEM,
  props<{ itemObj: ItemDataI, yearName: string, monthName: string, dayName: string }>()
)

export const createItemSuccessAction = createAction(
  ActionTypes.CREATE_ITEM_SUCCESS,
  props<{ response: any }>()
)

export const createItemFailureAction = createAction(ActionTypes.CREATE_ITEM_FAILURE)
