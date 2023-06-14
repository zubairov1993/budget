import { Component, inject } from '@angular/core'

import { SharedService } from './shared/services/shared.service'
import { AuthService } from './auth/services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sharedService = inject(SharedService)
  authService = inject(AuthService)

  constructor() {}

  toggleShowPrice(): void {
    this.sharedService.showPrice$.next(!this.sharedService.showPrice$.value)
  }
}
