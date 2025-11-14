import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { VendorsComponent } from './pages/vendors/vendors.component';
import { UsersComponent } from './pages/users/users.component';
import { PredictionsComponent } from './pages/predictions/predictions.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'vendors', component: VendorsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'predictions', component: PredictionsComponent },
  { path: '**', redirectTo: '/dashboard' }
];
