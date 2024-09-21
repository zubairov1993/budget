import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { startWith, switchMap } from 'rxjs';
import { FilteredItemI, SharedService, YearDataI } from 'src/app/shared';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchListComponent implements OnInit {
  private readonly sharedService = inject(SharedService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly columns = ['name', 'category', 'priceRu', 'date'];

  filteredItems: FilteredItemI[] = [];
  categories: string[];

  readonly testForm = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(''),
    date: new FormControl(null),
  });

  constructor() {
    this.categories = this.sharedService.categories;
  }

  ngOnInit(): void {}

  getNamesPopular(): string[] {
    return this.sharedService.popularItems$.getValue().map((item) => item.name);
  }

  filterItemsByNameAndCategoryWithDate(): void {
    const name = this.testForm.controls.name.value;
    const category = this.testForm.controls.category.value;
    const filteredItems: FilteredItemI[] = [];

    this.sharedService.getBudget().subscribe((data) => {
      if (data?.length !== 0) {
        data.forEach((year: YearDataI) => {
          year.months.forEach((month) => {
            month.days.forEach((day) => {
              day.items.forEach((item) => {
                const matchesName = name
                  ? item.name?.toLowerCase().includes(name?.toLowerCase())
                  : false;
                const matchesCategory = category
                  ? item.category?.toLowerCase() === category?.toLowerCase()
                  : false;

                // Изменяем условие фильтрации: если совпадает хотя бы одно из полей
                if (matchesName || matchesCategory) {
                  filteredItems.push({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    priceRu: item.priceRu,
                    date: day.date,
                  });
                }
              });
            });
          });
        });
      }
      this.filteredItems = filteredItems;
      console.log('this.filteredItems: ', this.filteredItems);
      this.cdr.detectChanges();
    });
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
    console.log(
      'this.testForm.controls.name: ',
      this.testForm.controls.date.value,
    );
  }
}
