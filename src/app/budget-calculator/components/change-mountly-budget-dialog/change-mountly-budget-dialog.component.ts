import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';

import {
  BudgetStateI,
  SharedService,
  updateMountlyBudgetAction,
  updateMountlyBudgetSuccessAction,
} from 'src/app/shared';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-change-mountly-budget-dialog',
  templateUrl: './change-mountly-budget-dialog.component.html',
  styleUrls: ['./change-mountly-budget-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ChangeMountlyBudgetDialogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  sharedService = inject(SharedService);
  formBuilder = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  private store = inject(Store<BudgetStateI>);
  private actions$ = inject(Actions);

  currentMonthlyBudget: number = 0;

  isLoading: boolean = false;
  allSubscription: Subscription[] = [];

  form: FormGroup = this.formBuilder.group({
    monthlyBudget: [null, [Validators.required]],
  });

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<number, number>,
  ) {}

  ngOnInit(): void {
    const monthlyBudget = this.sharedService.monthlyBudget$.subscribe(
      (count) => {
        this.currentMonthlyBudget = count;
        this.form.controls['monthlyBudget'].setValue(this.currentMonthlyBudget);
        this.cdr.detectChanges();
      },
    );
    const actions = this.actions$
      .pipe(ofType(updateMountlyBudgetSuccessAction), take(1))
      .subscribe(() => this.context.completeWith(this.form.value));
    this.allSubscription.push(monthlyBudget, actions);
  }

  submit(): void {
    if (
      this.form.controls['monthlyBudget'].value !== this.currentMonthlyBudget
    ) {
      this.isLoading = true;
      this.cdr.detectChanges();
      const currentDate: Date = new Date();
      const currentYear: number = currentDate.getFullYear();

      const data = {
        year: currentYear,
        monthlyBudget: this.form.controls['monthlyBudget'].value,
        bool: false,
      };
      this.store.dispatch(updateMountlyBudgetAction(data));
    }
  }

  errorProcessing(error: any): void {
    console.log('error', error);
    this.isLoading = false;
    this.cdr.detectChanges();
    this.context.completeWith(this.form.value);
    if (error.status === 401) this.router.navigate(['/auth']);
  }

  clear(): void {
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
