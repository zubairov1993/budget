import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiComparator } from '@taiga-ui/addon-table';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { startWith, switchMap } from 'rxjs';
import { FilteredItemI, SharedService, YearDataI } from 'src/app/shared';

@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SearchListComponent implements OnInit {
  private readonly sharedService = inject(SharedService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly columns = ['name', 'category', 'priceRu', 'date'];

  filteredItems: FilteredItemI[] = [];
  sortedItems: FilteredItemI[] = [];
  categories: string[] = [];
  totalSpent: number = 0;

  // Создаем компараторы
  protected readonly nameComparator: TuiComparator<FilteredItemI> = (a, b) =>
    a.name.localeCompare(b.name);
  protected readonly categoryComparator: TuiComparator<FilteredItemI> = (
    a,
    b,
  ) => a.category.localeCompare(b.category);
  protected readonly priceComparator: TuiComparator<FilteredItemI> = (a, b) =>
    a.priceRu - b.priceRu;
  protected readonly dateComparator: TuiComparator<FilteredItemI> = (a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();
  currentSorter: TuiComparator<FilteredItemI> = (a, b) => 0; // Дефолтный компаратор
  sortDirection: 1 | -1 = 1; // Обновили тип
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
    let totalSpent = 0;

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

                if (matchesName || matchesCategory) {
                  filteredItems.push({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    priceRu: item.priceRu,
                    date: day.date,
                  });
                  totalSpent += item.priceRu; // Увеличиваем сумму
                }
              });
            });
          });
        });
      }

      this.filteredItems = filteredItems;
      this.totalSpent = totalSpent;
      this.sortItems(); // Применяем сортировку
      this.cdr.detectChanges();
    });
  }

  // Устанавливаем текущий сортировщик
  setSorter(sorter: TuiComparator<FilteredItemI>): void {
    if (this.currentSorter === sorter) {
      this.sortDirection = this.sortDirection === 1 ? -1 : 1; // Меняем направление
    } else {
      this.currentSorter = sorter;
      this.sortDirection = 1; // По умолчанию сортировка по возрастанию
    }
    this.sortItems();
  }

  // Логика сортировки
  sortItems(): void {
    this.sortedItems = [...this.filteredItems].sort((a, b) =>
      this.currentSorter ? this.currentSorter(a, b) * this.sortDirection : 0,
    );
  }

  trackById(index: number, item: FilteredItemI): string {
    return item.id;
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
