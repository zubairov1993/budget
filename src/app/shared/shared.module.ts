import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { TuiButtonModule, TuiDialogModule, TuiTooltipModule, TuiCalendarModule, TuiHintModule } from '@taiga-ui/core'
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
import { TuiBarModule, TuiLegendItemModule, TuiRingChartModule } from '@taiga-ui/addon-charts'
import { TuiHoveredModule } from '@taiga-ui/cdk'

import { HidePricePipe } from './pipes/hide-price.pipe'

@NgModule({
  declarations: [ HidePricePipe ],
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
		HidePricePipe,
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule { }
