import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core'
import { HttpClientModule } from '@angular/common/http'

import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiCheckboxBlockModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit'
import { TuiTableModule } from '@taiga-ui/addon-table'
import { TuiTooltipModule } from '@taiga-ui/core'
import { TuiBarModule, TuiLegendItemModule, TuiRingChartModule } from '@taiga-ui/addon-charts'
import { TuiHoveredModule } from '@taiga-ui/cdk'
import { TuiCalendarModule } from '@taiga-ui/core'

@NgModule({
  declarations: [],
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
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule { }
