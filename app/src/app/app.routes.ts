import { Routes } from '@angular/router';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'transactions'
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    title: 'MorTrack - Transactions'
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    title: 'MorTrack - Power BI Analytics'
  },
  {
    path: '**',
    redirectTo: 'transactions'
  }
];
