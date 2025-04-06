import { Component, Input, ChangeDetectionStrategy, WritableSignal, signal, OnInit } from '@angular/core';

import { MonthDataI, YearDataI } from 'src/app/shared';

@Component({
  selector: 'app-months-list',
  templateUrl: './months-list.component.html',
  styleUrls: ['./months-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MonthsListComponent implements OnInit {
  @Input() yearProps: YearDataI | null = null;
  protected readonly months: WritableSignal<MonthDataI[]>;

  constructor() {
    this.months = signal<MonthDataI[]>([]);
  }

  ngOnInit(): void {
    this.months.set(this.yearProps?.months ? this.yearProps?.months : []);
  }

  protected isCurrentMonth(month: number): boolean {
    const currentDate: Date = new Date();
    return month === currentDate.getMonth() + 1;
  }

  protected getMonthNameByIndex(index: number): string {
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
}
