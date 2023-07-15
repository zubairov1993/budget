import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'

import { environment } from "src/environments/environment"

import { AuthService } from '../../auth/services/auth.service'

import { ItemDataI } from '../interfaces/budget.interface'

@Injectable({ providedIn: "root" })

export class SharedService {
  http = inject(HttpClient)
  authService = inject(AuthService)
  currency$: BehaviorSubject<string> = new BehaviorSubject<string>('Тенге')
  showPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  popularItems$: BehaviorSubject<ItemDataI[]> = new BehaviorSubject<ItemDataI[]>([])
  catogories = [
    'Еда',
    'Вещи',
    'Медицинское',
    'Детское',
    'Техника',
    'Дорога',
    'Аренда',
    'Учеба',
    'Прочее',
  ]

  getBudget(): Observable<any> {
    const uid = this.authService.localId
    return this.http.get<any>(`${environment.firebaseConfig.databaseURL}/years/${uid}.json`)
  }
}
