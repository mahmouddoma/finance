import { Routes } from '@angular/router';
import { DashboardLayout } from './Components/Feature/Dashboard/dashboard-layout/dashboard-layout';
import { LoginComponent } from './Components/Feature/Auth/login/login';
import { RegisterComponent } from './Components/Feature/Auth/register/register';
import { VerifyEmailComponent } from './Components/Feature/Auth/verify-email/verify-email';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'dashboard', component: DashboardLayout },
];
