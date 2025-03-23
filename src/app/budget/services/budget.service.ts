import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/services/auth.service';
import { DayDataI, ItemDataI, MonthDataI, YearDataI } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  // firebase =================================================================

  createYear(item: YearDataI): Observable<any> {
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}.json`;
    return this.http.post<any>(route, item);
  }

  createMonth(yearName: string, item: MonthDataI): Observable<any> {
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months.json`;
    return this.http.post<any>(route, item);
  }

  createDay(
    yearName: string,
    monthName: string,
    item: DayDataI,
  ): Observable<any> {
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months/${monthName}/days.json`;
    return this.http.post<any>(route, item);
  }

  createItem(
    yearName: string,
    monthName: string,
    dayName: string,
    item: ItemDataI,
  ): Observable<any> {
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months/${monthName}/days/${dayName}/items.json`;
    return this.http.post<any>(route, item);
  }

  deleteItem(
    yearName: string,
    monthName: string,
    dayName: string,
    itemId: string,
  ): Observable<any> {
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months/${monthName}/days/${dayName}/items/${itemId}.json`;
    return this.http.delete(route);
  }
}
