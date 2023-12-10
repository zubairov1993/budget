import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { SharedService } from '../../services';

@Directive({
  selector: '[appCurrencyConverter]'
})
export class CurrencyConverterDirective implements OnChanges {
  sharedService = inject(SharedService)
  templateRef = inject(TemplateRef)
  viewContainer = inject(ViewContainerRef)

  @Input() appCurrencyConverterAmount: number = 0;
  @Input() appCurrencyConverterFrom: 'Тенге' | 'Рубль' = 'Тенге';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.viewContainer.clear();
    this.sharedService.currency$.subscribe(currency => {
      let convertedAmount = this.appCurrencyConverterAmount;
      if (this.appCurrencyConverterFrom !== currency) {
        convertedAmount = this.appCurrencyConverterFrom === 'Тенге' ?
          this.sharedService.convertToRub(this.appCurrencyConverterAmount) :
          this.sharedService.convertToTenge(this.appCurrencyConverterAmount);
      }
      const currencySymbol = currency === 'Тенге' ? '₸' : '₽';
      const context = { $implicit: `${convertedAmount} ${currencySymbol}` };
      this.viewContainer.createEmbeddedView(this.templateRef, context);
    });
  }
}
