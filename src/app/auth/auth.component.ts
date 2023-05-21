import { Component, ChangeDetectionStrategy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { AuthService } from './services/auth.service'

import { IUser } from './interfaces/auth.interface'

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
  isSubmitted: boolean = false

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) return

    this.isSubmitted = true

    const user: IUser = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      returnSecureToken: true
    }

    this.authService.login(user).subscribe(() => {
      this.loginForm.reset()
      this.isSubmitted = false
      this.router.navigate(['/'])
    }, (error: any) => this.errorProcessing(error))
  }

  errorProcessing(error: any) {
    console.log('error', error)
  }
}
