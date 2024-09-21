import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./budget/budget.module').then((m) => m.BudgetModule),
      },
      {
        path: 'list/actual',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./budget/budget.module').then((m) => m.BudgetModule),
      },
      {
        path: 'list/search',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./budget/budget.module').then((m) => m.BudgetModule),
      },
      {
        path: 'chart',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./chart/chart.module').then((m) => m.ChartModule),
      },
      { path: '**', redirectTo: '/list/actual' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
