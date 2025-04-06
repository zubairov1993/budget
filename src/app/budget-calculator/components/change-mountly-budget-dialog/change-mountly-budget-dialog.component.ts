import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
  OnDestroy,
  WritableSignal,
  signal,
} from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { finalize, Subject, take, takeUntil } from 'rxjs';

import { SharedService } from 'src/app/shared';

@Component({
  selector: 'app-change-mountly-budget-dialog',
  templateUrl: './change-mountly-budget-dialog.component.html',
  styleUrls: ['./change-mountly-budget-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ChangeMouthyBudgetDialogComponent implements OnInit, OnDestroy {
  private readonly sharedService = inject(SharedService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly loading: WritableSignal<boolean>;

  form: FormGroup = this.formBuilder.group({
    monthlyBudget: [null, [Validators.required]],
  });
  private readonly destroy$: Subject<void>;

  private get monthlyBudget(): WritableSignal<number> {
    return this.sharedService.monthlyBudget;
  }

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<number, number>,
  ) {
    this.loading = signal<boolean>(false);
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.form.controls['monthlyBudget'].setValue(this.monthlyBudget());
  }

  protected submit(): void {
    if (this.form.controls['monthlyBudget'].value !== this.monthlyBudget()) {
      this.loading.set(true);
      this.sharedService
        .updateMonthlyBudget(this.form.controls['monthlyBudget'].value, false)
        .pipe(
          take(1),
          takeUntil(this.destroy$),
          finalize(() => this.loading.set(false)),
        )
        .subscribe((response: { monthlyBudget: number }) => {
          this.context.completeWith(this.form.value);
          this.monthlyBudget.set(response.monthlyBudget);
        });
    }
  }

  protected clear(): void {
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
