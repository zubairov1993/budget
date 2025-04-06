import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserI } from './interfaces/auth.interface';
import { AuthService } from './services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const user: UserI = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      returnSecureToken: true,
    };

    this.authService.login(user).subscribe(() => {
      this.router.navigate(['/list/actual']);
    });
  }
}
