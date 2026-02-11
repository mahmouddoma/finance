import { Routes } from '@angular/router';
import { DashboardLayout } from './Components/Feature/Dashboard/dashboard-layout/dashboard-layout';
import { LoginComponent } from './Components/Feature/Auth/login/login';
import { RegisterComponent } from './Components/Feature/Auth/register/register';
import { VerifyEmailComponent } from './Components/Feature/Auth/verify-email/verify-email';
import { MonthlyDashboard } from './Components/Feature/Dashboard/monthly-dashboard/monthly-dashboard';
import { AboutFelosyComponent } from './Components/Feature/Info/about-felosy/about-felosy';
import { FeaturesComponent } from './Components/Feature/Info/features/features';
import { PrivacyPolicyComponent } from './Components/Feature/Info/privacy-policy/privacy-policy';
import { TermsConditionsComponent } from './Components/Feature/Info/terms-conditions/terms-conditions';

import { authGuard } from './Core/Guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'dashboard', component: DashboardLayout, canActivate: [authGuard] },
  { path: 'dashboard/:year/:month', component: MonthlyDashboard, canActivate: [authGuard] },

  // Info Routes
  { path: 'about', component: AboutFelosyComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsConditionsComponent },
];
