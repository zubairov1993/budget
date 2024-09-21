import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  TuiButtonModule,
  TuiDialogModule,
  TuiTooltipModule,
  TuiCalendarModule,
  TuiHintModule,
  TuiTextfieldControllerModule,
  TuiLoaderModule,
  TuiHostedDropdownModule,
  TuiDataListModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiCheckboxBlockModule,
  TuiStringifyContentPipeModule,
  TuiInputDateModule,
} from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  TuiBarModule,
  TuiLegendItemModule,
  TuiRingChartModule,
} from '@taiga-ui/addon-charts';
import { TuiHoveredModule } from '@taiga-ui/cdk';

import {
  CreateDayEffect,
  CreateItemEffect,
  CreateMonthEffect,
  CreateYearEffect,
  DeleteItemEffect,
  GetBudgetEffect,
  UpdateMountlyBudgetEffect,
  reducers,
} from './store';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TuiDialogModule,
    TuiFilterByInputPipeModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiSelectModule,
    TuiInputNumberModule,
    TuiAccordionModule,
    TuiTableModule,
    TuiButtonModule,
    TuiCheckboxBlockModule,
    TuiTooltipModule,
    TuiStringifyContentPipeModule,
    TuiLegendItemModule,
    TuiBarModule,
    TuiRingChartModule,
    TuiHoveredModule,
    TuiCalendarModule,
    TuiHintModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiInputDateModule,
    EffectsModule.forFeature([
      GetBudgetEffect,
      CreateYearEffect,
      CreateMonthEffect,
      CreateDayEffect,
      CreateItemEffect,
      DeleteItemEffect,
      UpdateMountlyBudgetEffect,
    ]),
    StoreModule.forFeature('budget', reducers),
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    TuiDialogModule,
    TuiFilterByInputPipeModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiSelectModule,
    TuiInputNumberModule,
    TuiAccordionModule,
    TuiTableModule,
    TuiButtonModule,
    TuiCheckboxBlockModule,
    TuiTooltipModule,
    TuiStringifyContentPipeModule,
    TuiLegendItemModule,
    TuiBarModule,
    TuiRingChartModule,
    TuiHoveredModule,
    TuiCalendarModule,
    TuiHintModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiInputDateModule,
  ],
  providers: [],
  bootstrap: [],
})
export class SharedModule {}
