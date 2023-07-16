import { Pipe, PipeTransform, inject } from '@angular/core'

import { SharedService } from '../services/shared.service'

@Pipe({ name: 'isShowPrice', pure: false })
export class HidePricePipe implements PipeTransform {
  sharedService = inject(SharedService)

  transform(price: number | null): string {
    if (this.sharedService.showPrice$.value) {
      return price !== null && price !== undefined ? price.toString() : ''
    } else {
      return '***'
    }
  }
}
