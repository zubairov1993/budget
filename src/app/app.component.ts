import { Component, inject } from '@angular/core'
import { AuthService } from './auth/services/auth.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  authService = inject(AuthService)
}
