import {
  Component,
  inject,
  Injector,
  OnDestroy,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { TuiDialogService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AddProductDialogComponent } from '../budget/components/add-product-dialog/add-product-dialog.component';
import { SharedService } from '../shared';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NavMenuComponent implements OnDestroy {
  router = inject(Router);
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  dialogs = inject(TuiDialogService);
  injector = inject(Injector);
  cdr = inject(ChangeDetectorRef);
  renderer = inject(Renderer2);
  allSubscription: Subscription[] = [];

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(AddProductDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Добавление записи',
    },
  );

  showDialog(): void {
    if (this.authService.isAuthenticated()) {
      const dialog = this.dialog.subscribe();
      this.allSubscription.push(dialog);
    } else {
      this.authService.logout();
      this.router.navigate(['/auth'], { queryParams: { authFailed: true } });
    }
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
