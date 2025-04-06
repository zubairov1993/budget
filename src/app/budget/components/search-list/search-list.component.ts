import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiComparator } from '@taiga-ui/addon-table';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { startWith, switchMap } from 'rxjs';
import { FilteredItemI, ItemDataI, SharedService, YearDataI } from 'src/app/shared';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SearchListComponent {
  private readonly sharedService = inject(SharedService);

  protected readonly columns: string[];
  protected filteredItems: WritableSignal<FilteredItemI[]>;
  protected sortedItems: WritableSignal<FilteredItemI[]>;
  protected totalSpent: WritableSignal<number>;

  protected readonly nameComparator: TuiComparator<FilteredItemI>;
  protected readonly categoryComparator: TuiComparator<FilteredItemI>;
  protected readonly priceComparator: TuiComparator<FilteredItemI>;
  protected readonly dateComparator: TuiComparator<FilteredItemI>;
  protected currentSorter: TuiComparator<FilteredItemI>;
  protected sortDirection: 1 | -1;
  readonly testForm = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(''),
    date: new FormControl(null),
  });

  private get budget(): WritableSignal<YearDataI[] | null> {
    return this.sharedService.budget;
  }

  protected get categories(): WritableSignal<string[]> {
    return this.sharedService.categories;
  }

  protected get popularItems(): WritableSignal<ItemDataI[]> {
    return this.sharedService.popularItems;
  }

  constructor() {
    this.columns = ['name', 'category', 'priceRu', 'date'];
    this.filteredItems = signal<FilteredItemI[]>([]);
    this.sortedItems = signal<FilteredItemI[]>([]);
    this.totalSpent = signal<number>(0);
    this.nameComparator = (a, b) => a.name.localeCompare(b.name);
    this.categoryComparator = (a, b) => a.category.localeCompare(b.category);
    this.priceComparator = (a, b) => a.priceRu - b.priceRu;
    this.dateComparator = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
    this.currentSorter = this.nameComparator;
    this.sortDirection = 1;
  }

  getNamesPopular(): string[] {
    return this.popularItems().map((item) => item.name);
  }

  filterItemsByNameAndCategoryWithDate(): void {
    const name = this.testForm.controls.name.value;
    const category = this.testForm.controls.category.value;
    const filteredItems: FilteredItemI[] = [];
    let totalSpent = 0;

    if (!this.budget()) {
      return;
    }

    this.budget()!.forEach((year: YearDataI) => {
      year.months.forEach((month) => {
        month.days.forEach((day) => {
          day.items.forEach((item) => {
            const matchesName = name ? item.name?.toLowerCase().includes(name?.toLowerCase()) : false;
            const matchesCategory = category ? item.category?.toLowerCase() === category?.toLowerCase() : false;

            if (matchesName || matchesCategory) {
              filteredItems.push({
                id: item.id,
                name: item.name,
                category: item.category,
                priceRu: item.priceRu,
                date: day.date,
              });
              totalSpent += item.priceRu;
            }
          });
        });
      });
    });

    this.filteredItems.set(filteredItems);
    this.totalSpent.set(totalSpent);
    this.sortItems();
  }

  setSorter(sorter: TuiComparator<FilteredItemI>): void {
    if (this.currentSorter === sorter) {
      this.sortDirection = this.sortDirection === 1 ? -1 : 1; // Меняем направление
    } else {
      this.currentSorter = sorter;
      this.sortDirection = 1; // По умолчанию сортировка по возрастанию
    }
    this.sortItems();
  }

  sortItems(): void {
    const items = this.filteredItems();
    if (items.length === 0) {
      this.sortedItems.set([]);
      return;
    }

    if (this.currentSorter(items[0], items[0]) === 0) {
      this.sortedItems.set(items);
      return;
    }

    this.sortedItems.set(items.sort((a, b) => this.currentSorter(a, b) * this.sortDirection));
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
    console.log('this.testForm.controls.name: ', this.testForm.controls.date.value);
  }
}
