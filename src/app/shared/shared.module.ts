import { TuiTable } from '@taiga-ui/addon-table';
import {
  TuiTextfieldControllerModule,
  TuiTooltipModule,
  TuiInputModule,
  TuiInputDateModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from '@taiga-ui/legacy';
import { TuiHovered } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TuiCalendar, TuiDataList, TuiLoader, TuiDropdown, TuiDialog, TuiButton, TuiHint } from '@taiga-ui/core';
import {
  TuiDataListWrapper,
  TuiAccordion,
  TuiStringifyContentPipe,
  TuiFilterByInputPipe,
  TuiBlock,
  TuiCheckbox,
} from '@taiga-ui/kit';
import { TuiBar, TuiLegendItem, TuiRingChart } from '@taiga-ui/addon-charts';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TuiDialog,
    TuiFilterByInputPipe,
    ...TuiDataListWrapper,
    TuiInputModule,
    TuiSelectModule,
    TuiInputNumberModule,
    ...TuiAccordion,
    ...TuiTable,
    TuiButton,
    TuiBlock,
    TuiCheckbox,
    TuiTooltipModule,
    TuiStringifyContentPipe,
    TuiLegendItem,
    TuiBar,
    TuiRingChart,
    TuiHovered,
    TuiCalendar,
    ...TuiHint,
    TuiTextfieldControllerModule,
    TuiLoader,
    ...TuiDropdown,
    ...TuiDataList,
    TuiInputDateModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    TuiDialog,
    TuiFilterByInputPipe,
    ...TuiDataListWrapper,
    TuiInputModule,
    TuiSelectModule,
    TuiInputNumberModule,
    ...TuiAccordion,
    ...TuiTable,
    TuiButton,
    TuiBlock,
    TuiCheckbox,
    TuiTooltipModule,
    TuiStringifyContentPipe,
    TuiLegendItem,
    TuiBar,
    TuiRingChart,
    TuiHovered,
    TuiCalendar,
    ...TuiHint,
    TuiTextfieldControllerModule,
    TuiLoader,
    ...TuiDropdown,
    ...TuiDataList,
    TuiInputDateModule,
  ],
  providers: [],
  bootstrap: [],
})
export class SharedModule {}
