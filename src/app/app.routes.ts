import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { VendorsComponent } from './pages/vendors/vendors.component';
import { UsersComponent } from './pages/users/users.component';
import { PredictionsComponent } from './pages/predictions/predictions.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'invoices', component: InvoicesComponent, canActivate: [authGuard] },
  { path: 'vendors', component: VendorsComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  {
    path: 'predictions',
    component: PredictionsComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login' },
];
