import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { startWith, switchMap } from 'rxjs';
import { SharedService } from 'src/app/shared';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListComponent implements OnInit {
  private sharedService = inject(SharedService)

  protected readonly columns = [ 'name', 'category', 'priceT', 'priceRu', 'date' ]

  searchList: any[] = []

  readonly testForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(null),
  });


  ngOnInit(): void {
  }

  getNamesPopular(): string[] {
    return this.sharedService.popularItems$.getValue().map((item) => item.name)
  }

  selectedName(): void {
    console.log('this.testForm.controls.name: ', this.testForm.controls.name.value);

  }

  onDayClick(day: any): void {
    console.log('day: ', day);
    // if (this.date === null || !this.date.isSingleDay) this.date = new TuiDayRange(day, day)
    // this.date = TuiDayRange.sort(this.date.from, day)
    // const dateFrom = { year: this.date.from.year, month: this.date.from.month + 1, day: this.date.from.day }
    // console.log('dateFrom: ', dateFrom);
    // const dateTo = { year: this.date.to.year, month: this.date.to.month + 1, day: this.date.to.day }
    // console.log('dateTo: ', dateTo);
  }

  selectedDate(): void {
    console.log('this.testForm.controls.name: ', this.testForm.controls.date.value);

  }

}
