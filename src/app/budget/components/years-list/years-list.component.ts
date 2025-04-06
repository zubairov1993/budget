import { Component, ChangeDetectionStrategy, inject, WritableSignal } from '@angular/core';

import { SharedService, YearDataI } from 'src/app/shared';

@Component({
  selector: 'app-years-list',
  templateUrl: './years-list.component.html',
  styleUrls: ['./years-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class YearsListComponent {
  private readonly sharedService = inject(SharedService);

  protected get budget(): WritableSignal<YearDataI[] | null> {
    return this.sharedService.budget;
  }

  protected isCurrentYear(year: number): boolean {
    const currentDate: Date = new Date();
    return year === currentDate.getFullYear();
  }
}
