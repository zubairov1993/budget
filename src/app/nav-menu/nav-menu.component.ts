import {
  Component,
  inject,
  Injector,
  OnDestroy,
  ChangeDetectionStrategy,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { TuiDialogService } from '@taiga-ui/core';
import { Subject, takeUntil } from 'rxjs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

import { AddProductDialogComponent } from '../budget/components/add-product-dialog/add-product-dialog.component';
import { SharedService, YearDataI } from '../shared';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class NavMenuComponent implements OnDestroy {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  private readonly sharedService = inject(SharedService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);

  private readonly destroy$: Subject<void>;

  protected get budget(): WritableSignal<YearDataI[] | null> {
    return this.sharedService.budget;
  }

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(AddProductDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Добавление записи',
    },
  );

  constructor() {
    this.destroy$ = new Subject<void>();
  }

  protected showDialog(): void {
    if (this.authService.isAuthenticated()) {
      this.dialog.pipe(takeUntil(this.destroy$)).subscribe();
    } else {
      this.authService.logout();
      this.router.navigate(['/auth'], { queryParams: { authFailed: true } });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
