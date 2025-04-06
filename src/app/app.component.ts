import { Component, inject, OnDestroy, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { AuthService } from './auth/services/auth.service';
import { SharedService, YearDataI } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnDestroy {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sharedService = inject(SharedService);
  private readonly destroy$: Subject<void>;

  protected get budget(): WritableSignal<YearDataI[] | null> {
    return this.sharedService.budget;
  }

  constructor() {
    this.destroy$ = new Subject<void>();
    this.sharedService.getBudget();

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd && !this.budget()) {
        this.sharedService.getBudget();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
