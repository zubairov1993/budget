import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MonthDataI, SharedService, YearDataI } from 'src/app/shared';

@Component({
    selector: 'app-months-list',
    templateUrl: './months-list.component.html',
    styleUrls: ['./months-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MonthsListComponent implements OnInit, OnDestroy {
  sharedService = inject(SharedService);
  cdr = inject(ChangeDetectorRef);

  @Input() yearProps: YearDataI | null = null;
  months: MonthDataI[] = [];
  allSubscription: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    // const currency = this.sharedService.currency$.subscribe(() =>
    //   this.cdr.detectChanges(),
    // );
    this.months = this.yearProps?.months ? this.yearProps?.months : [];
  }

  isCurrentMonth(month: number): boolean {
    const currentDate: Date = new Date();
    return month === currentDate.getMonth() + 1;
  }

  getMonthNameByIndex(index: number): string {
    const monthNames: string[] = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    return monthNames[index];
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
